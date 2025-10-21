// /app/api/admin/products/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// === Multer: сохраняем только если пришли ФАЙЛЫ ===
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.cwd(), "public/uploads"));
  },
  filename: (_req, _file, cb) => {
    cb(null, uuidv4() + ".webp");
  },
});
const upload = multer({ storage });

// === helpers ===
function toBool(v) {
  if (typeof v === "boolean") return v;
  if (v == null) return false;
  const s = String(v).toLowerCase();
  return s === "true" || s === "1" || s === "on";
}
function toNum(v, d = 0) {
  if (v == null || v === "") return d;
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}
function toNullableInt(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function parseJsonSafe(str, def = []) {
  if (!str) return def;
  try {
    if (typeof str === "string") return JSON.parse(str);
    return str;
  } catch {
    return def;
  }
}
function mapImagesUrlToLegacy(images) {
  // вход: [{ url, sort? }] -> [{ image: url, sort? }]
  return (images || []).map((it, idx) => ({
    image: it?.url ?? "",
    ...(typeof it?.sort === "number" ? { sort: it.sort } : { sort: idx }),
  }));
}

// === POST /api/admin/products  (CREATE) ===
export async function POST(req) {
  try {
    // 1) читаем форму (без multer) что бы понять: прислали URLы?
    const preForm = await req.formData();

    const thumbnailUrl = preForm.get("thumbnailUrl"); // строка или null
    const imagesJsonStr = preForm.get("imagesJson");  // строка JSON или null

    // основные поля
    const title = preForm.get("title") || "";
    const description = preForm.get("description") || "";
    const price = toNum(preForm.get("price"), 0);
    const discountPercentage = toNum(preForm.get("discountPercentage"), 0);
    const stock = toNum(preForm.get("stock"), 0);
    const content = preForm.get("content") || "";
    const titleLink = preForm.get("titleLink") || "";
    const rating = toNum(preForm.get("rating"), 0);

    // флаги
    const banner = toBool(preForm.get("banner"));
    const discounts = toBool(preForm.get("discounts"));
    const povsednevnaya = toBool(preForm.get("povsednevnaya"));
    const recommended = toBool(preForm.get("recommended"));

    // связи (id)
    const categoryId = toNullableInt(preForm.get("categoryId"));
    const subCategoryId = toNullableInt(preForm.get("subCategoryId"));
    const brandId = toNullableInt(preForm.get("brandId"));

    // строковые дубли
    const category = preForm.get("category") || "";
    const subcategory = preForm.get("subcategory") || "";
    const brand = preForm.get("brand") || "";
    const article = preForm.get("article") || null;

    // info (приходит строкой JSON)
    const info = parseJsonSafe(preForm.get("info"), []);

    let thumbnailStrForDB = "[]"; // по старой совместимости — строка с JSON массивом
    let imagesJsonForDB = [];     // колонка JSON

    // 2) ВАРИАНТ А: пришли thumbnailUrl / imagesJson — используем их (без файлов)
    if (thumbnailUrl || imagesJsonStr) {
      const parsedImages = parseJsonSafe(imagesJsonStr, []); // ожидаем [{url, sort}]
      const mapped = mapImagesUrlToLegacy(parsedImages);     // -> [{image, sort}]

      // если thumbnailUrl нет, но images есть — берём первую
      const resolvedThumb = thumbnailUrl || (mapped[0]?.image || "");

      thumbnailStrForDB = JSON.stringify(resolvedThumb ? [{ image: resolvedThumb }] : []);
      imagesJsonForDB = mapped;

    } else {
      // 3) ВАРИАНТ Б: URLов нет — значит ждём файлы и сохраняем как раньше
      // прогон через multer
      const error = await new Promise((resolve, reject) => {
        upload.any()(req, {}, (err) => (err ? reject(err) : resolve()));
      });
      if (error) {
        return new NextResponse("Ошибка при загрузке файлов", { status: 500 });
      }

      const formData = await req.formData();
      const thumbFile = formData.get("thumbnail");
      const imageFiles = formData.getAll("images");

      const thumbnailArr = [];
      const imagesArr = [];

      if (thumbFile && typeof thumbFile === "object") {
        const thumbName = uuidv4() + ".webp";
        const thumbPath = path.resolve(process.cwd(), "public/uploads", thumbName);
        const buf = Buffer.from(await thumbFile.arrayBuffer());
        await fs.promises.writeFile(thumbPath, buf);
        thumbnailArr.push({ image: `/uploads/${thumbName}` });
      }

      for (const f of imageFiles) {
        if (!f || typeof f !== "object") continue;
        const imgName = uuidv4() + ".webp";
        const imgPath = path.resolve(process.cwd(), "public/uploads", imgName);
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.promises.writeFile(imgPath, buf);
        imagesArr.push({ image: `/uploads/${imgName}` });
      }

      thumbnailStrForDB = JSON.stringify(thumbnailArr);
      imagesJsonForDB = imagesArr;
    }

    const created = await prisma.product.create({
      data: {
        title,
        description,
        price,
        discountPercentage,
        stock,
        category,
        subcategory,
        brand,
        article,
        rating,
        titleLink,
        banner,
        discounts,
        povsednevnaya,
        recommended,
        content,
        // совместимость: thumbnail — строка JSON массива [{image}]
        thumbnail: thumbnailStrForDB,
        // images — JSON массив объектов
        images: imagesJsonForDB,
        // связи
        categoryId,
        subCategoryId,
        brandId,
        info, // Prisma JSON ok
      },
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e) {
    console.error("POST /products error:", e);
    return new NextResponse("Ошибка при добавлении товара", { status: 500 });
  }
}

// === GET /api/admin/products  (LIST) ===
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const subcategory = searchParams.get("subcategory");
    const where = subcategory ? { subcategory: subcategory.toString() } : {};
    const items = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    if (!items || items.length === 0) {
      return new NextResponse("Продукты не найдены", { status: 404 });
    }
    return new NextResponse(JSON.stringify(items), { status: 200 });
  } catch (e) {
    console.error("GET /products error:", e);
    return new NextResponse("Ошибка при получении товара", { status: 500 });
  }
}

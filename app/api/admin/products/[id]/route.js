// /app/api/admin/products/[id]/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// === Multer на случай файлов ===
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

/** Приведение к относительному пути внутри /uploads */
function toRelUpload(p) {
  if (!p) return "";
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (base && p.startsWith(base)) p = p.slice(base.length);
  if (p[0] !== "/") p = `/${p}`;
  return p;
}

/** Физически удалить файл, только если он в /uploads */
async function unlinkIfLocalUpload(rel) {
  if (!rel || !rel.startsWith("/uploads/")) return;
  const abs = path.resolve(process.cwd(), "public", rel.replace(/^\/+/, ""));
  try { await fs.promises.unlink(abs); } catch { }
}

/** Собрать все пути из thumbnail + images (string | {image} | {url}) */
function extractAllUploadPaths(product) {
  const out = new Set();

  // thumbnail: может быть строкой JSON массива или строкой пути
  const thumbRaw = product?.thumbnail;
  const thumbArr = parseJsonSafe(thumbRaw, null);
  if (Array.isArray(thumbArr) && thumbArr[0]) {
    const t = thumbArr[0].image || thumbArr[0].url || "";
    if (t) out.add(toRelUpload(t));
  } else if (typeof thumbRaw === "string" && thumbRaw) {
    out.add(toRelUpload(thumbRaw));
  }

  // images: массив строк или объектов
  const imagesArr = parseJsonSafe(product?.images, []);
  for (const it of imagesArr) {
    const p = (typeof it === "string") ? it : (it?.image || it?.url || "");
    if (p) out.add(toRelUpload(p));
  }

  return Array.from(out);
}

// === HANDLERS ===
export async function GET(_req, { params: { id } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) return new NextResponse("Продукт по id не найден", { status: 200 });
    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (e) {
    console.error("GET one error:", e);
    return new NextResponse("Ошибка при получении товара по id", { status: 500 });
  }
}

export async function PUT(req, { params: { id } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return new NextResponse("Продукт не найден", { status: 404 });

    // сначала читаем форму без multer — проверяем URL-вариант
    const preForm = await req.formData();

    const thumbnailUrl = preForm.get("thumbnailUrl"); // строка
    const imagesJsonStr = preForm.get("imagesJson");  // строка JSON

    // текущие изображения (совместимость с хранением строки JSON в thumbnail)
    let existingThumb = parseJsonSafe(product.thumbnail, []);
    let existingImages = Array.isArray(product.images) ? product.images : parseJsonSafe(product.images, []);

    // базовые поля
    const title = preForm.get("title") ?? product.title;
    const description = preForm.get("description") ?? product.description;
    const price = preForm.has("price") ? toNum(preForm.get("price"), product.price) : product.price;
    const discountPercentage = preForm.has("discountPercentage")
      ? toNum(preForm.get("discountPercentage"), product.discountPercentage)
      : product.discountPercentage;
    const stock = preForm.has("stock") ? toNum(preForm.get("stock"), product.stock) : product.stock;

    const category = preForm.has("category") ? (preForm.get("category") || "") : product.category;
    const subcategory = preForm.has("subcategory") ? (preForm.get("subcategory") || "") : product.subcategory;
    const brand = preForm.has("brand") ? (preForm.get("brand") || "") : product.brand;

    const rating = preForm.has("rating") ? toNum(preForm.get("rating"), product.rating) : product.rating;
    const titleLink = preForm.get("titleLink") ?? product.titleLink;

    const banner = preForm.has("banner") ? toBool(preForm.get("banner")) : product.banner;
    const discounts = preForm.has("discounts") ? toBool(preForm.get("discounts")) : product.discounts;
    const povsednevnaya = preForm.has("povsednevnaya") ? toBool(preForm.get("povsednevnaya")) : product.povsednevnaya;
    const recommended = preForm.has("recommended") ? toBool(preForm.get("recommended")) : product.recommended;

    const content = preForm.get("content") ?? product.content;
    const article = preForm.has("article") ? (preForm.get("article") || null) : product.article;

    // связи
    const categoryId = preForm.has("categoryId") ? toNullableInt(preForm.get("categoryId")) : product.categoryId;
    const subCategoryId = preForm.has("subCategoryId")
      ? toNullableInt(preForm.get("subCategoryId"))
      : product.subCategoryId;
    const brandId = preForm.has("brandId") ? toNullableInt(preForm.get("brandId")) : product.brandId;

    // info
    const info = preForm.has("info") ? parseJsonSafe(preForm.get("info"), product.info) : product.info;

    let newThumb = existingThumb;
    let newImages = existingImages;

    if (thumbnailUrl || imagesJsonStr) {
      // ВАРИАНТ А: обновление через URLы
      const parsedImages = parseJsonSafe(imagesJsonStr, []);
      const mapped = mapImagesUrlToLegacy(parsedImages); // -> [{image, sort}]
      const resolvedThumb = thumbnailUrl || (mapped[0]?.image || "");

      // thumbnail перезаписываем полностью, файлы на диске НЕ трогаем
      newThumb = JSON.stringify(resolvedThumb ? [{ image: resolvedThumb }] : []);
      newImages = mapped;
    } else {
      // ВАРИАНТ Б: файловый апдейт — как раньше
      const error = await new Promise((resolve, reject) => {
        upload.any()(req, {}, (err) => (err ? reject(err) : resolve()));
      });
      if (error) return new NextResponse("Ошибка при загрузке файла", { status: 500 });

      const formData = await req.formData();

      const imageFile = formData.get("thumbnail");
      const imgFiles = formData.getAll("images");

      // thumbnail — если прислали новый, удаляем старый файл и пишем новый
      if (imageFile && typeof imageFile === "object") {
        // удалить старый файл если он локальный
        const oldThumbName = Array.isArray(existingThumb) ? existingThumb[0]?.image : null;
        if (oldThumbName && oldThumbName.startsWith("/uploads/")) {
          const oldPath = path.resolve(process.cwd(), "public", oldThumbName.replace(/^\/+/, ""));
          try { await fs.promises.unlink(oldPath); } catch { }
        }
        const newName = uuidv4() + ".webp";
        const savePath = path.resolve(process.cwd(), "public/uploads", newName);
        const buf = Buffer.from(await imageFile.arrayBuffer());
        await fs.promises.writeFile(savePath, buf);
        newThumb = JSON.stringify([{ image: `/uploads/${newName}` }]);
      } else {
        // если не прислали — сохраняем как было (в прежнем формате строки/массива)
        newThumb = Array.isArray(existingThumb) ? JSON.stringify(existingThumb) : String(existingThumb || "[]");
      }

      // изображения — добавляем новые
      let acc = Array.isArray(existingImages) ? existingImages : parseJsonSafe(existingImages, []);
      if (Array.isArray(imgFiles)) {
        for (const imgFile of imgFiles) {
          if (!imgFile || typeof imgFile !== "object") continue;
          const newName = uuidv4() + ".webp";
          const savePath = path.resolve(process.cwd(), "public/uploads", newName);
          const buf = Buffer.from(await imgFile.arrayBuffer());
          await fs.promises.writeFile(savePath, buf);
          acc.push({ image: `/uploads/${newName}` });
        }
      }
      newImages = acc;
    }

    const data = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        price,
        discountPercentage,
        stock,
        category,
        subcategory,
        brand,
        rating,
        article,
        titleLink,
        banner,
        discounts,
        povsednevnaya,
        recommended,
        content,
        // thumbnail храним как строку JSON массива (совместимость)
        thumbnail: typeof newThumb === "string" ? newThumb : JSON.stringify(newThumb ?? []),
        // images — JSON массив
        images: newImages,
        // связи
        categoryId,
        subCategoryId,
        brandId,
        info,
      },
    });

    if (data) return NextResponse.json({ message: "Продукт обновлен" });
  } catch (e) {
    console.error("PUT /products/[id] error:", e);
    return new NextResponse("Ошибка при обновлении товара", { status: 500 });
  }
}

// DELETE — два сценария:
// 1) /api/admin/products/[id]?name=/uploads/xxx.webp  -> удалить конкретную картинку из images
// 2) /api/admin/products/[id] без name -> удалить весь продукт со всеми файлами (если они локальные)
export async function DELETE(req, { params: { id } }) {
  try {
    const pid = Number(id);
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name"); // /uploads/xxx.webp (или абсолютный)

    const product = await prisma.product.findUnique({ where: { id: pid } });
    if (!product) return new NextResponse("Продукт не найден", { status: 404 });

    // Удаление ОДНОГО изображения из images
    if (name) {
      const targetRel = toRelUpload(name);

      const imagesArr = parseJsonSafe(product.images, []);
      const filtered = imagesArr.filter((it) => {
        const p = (typeof it === "string") ? it : (it?.image || it?.url || "");
        return toRelUpload(p) !== targetRel;
      });

      // Удаляем физически файл, если локальный
      await unlinkIfLocalUpload(targetRel);

      // Нормализуем в { url, sort }
      const normalized = filtered.map((it, idx) => {
        if (typeof it === "string") return { url: toRelUpload(it), sort: idx };
        const v = it?.image || it?.url || "";
        return { url: toRelUpload(v), sort: idx };
      });

      await prisma.product.update({
        where: { id: pid },
        data: { images: normalized },
      });

      return new NextResponse("Изображение удалено!", { status: 200 });
    }

    // Полное удаление товара: чистим все локальные файлы + запись
    const allPaths = extractAllUploadPaths(product);
    await Promise.all(allPaths.map(unlinkIfLocalUpload));

    await prisma.product.delete({ where: { id: pid } });

    return new NextResponse("Продукт удалён!", { status: 200 });
  } catch (e) {
    console.error("DELETE /products/[id] error:", e);
    return new NextResponse("Ошибка при удалении товара", { status: 500 });
  }
}

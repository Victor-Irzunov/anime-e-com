import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* helpers */
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
function safeStr(v, max = 255) {
  if (v == null) return "";
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

/* === GET: список с поддержкой фильтров (категория/подкатегория/НОВИНКИ) === */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // фильтр по slug'ам
    const catSlug = searchParams.get("category");    // figurki
    const subSlug = searchParams.get("subcategory"); // statichnie-igrushki

    // ФИЛЬТР НОВИНОК: ?new=1 или ?days=10
    const isNewOnly = toBool(searchParams.get("new"));
    const daysParam = searchParams.get("days");
    const days = Number.isFinite(Number(daysParam)) ? Math.max(1, Number(daysParam)) : (isNewOnly ? 10 : null);
    const createdFrom = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

    const AND = [];

    if (catSlug) {
      const cat = await prisma.category.findFirst({
        where: { value: String(catSlug) },
        select: { id: true, name: true },
      });
      AND.push({
        OR: [
          { categoryRel: { is: { value: String(catSlug) } } },
          cat ? { categoryId: cat.id } : undefined,
          cat ? { category: cat.name } : { category: String(catSlug) },
        ].filter(Boolean),
      });
    }

    if (subSlug) {
      const sub = await prisma.subCategory.findFirst({
        where: { value: String(subSlug) },
        select: { id: true, name: true },
      });
      AND.push({
        OR: [
          { subCategoryRel: { is: { value: String(subSlug) } } },
          sub ? { subCategoryId: sub.id } : undefined,
          sub ? { subcategory: sub.name } : { subcategory: String(subSlug) },
        ].filter(Boolean),
      });
    }

    if (createdFrom) {
      AND.push({ createdAt: { gte: createdFrom } });
    }

    const where = AND.length ? { AND } : undefined;

    const rows = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        categoryRel: { select: { value: true } },
        subCategoryRel: { select: { value: true } },
        brandRel: { select: { value: true } },
      },
    });

    const items = rows.map((p) => ({
      ...p,
      categoryValue: p.categoryRel?.value ?? null,
      subcategoryValue: p.subCategoryRel?.value ?? null,
      brandValue: p.brandRel?.value ?? null,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("GET /api/product error:", e);
    return NextResponse.json({ ok: false, message: "Ошибка получения товаров" }, { status: 500 });
  }
}

/* === POST: создание товара (URL-вариант изображений) === */
export async function POST(req) {
  try {
    const form = await req.formData();

    // основные поля
    const title = safeStr(form.get("title"), 255);
    const description = String(form.get("description") || "");
    const price = toNum(form.get("price"), 0);
    const discountPercentage = toNum(form.get("discountPercentage"), 0);
    const stock = toNum(form.get("stock"), 0);
    const content = String(form.get("content") || "");
    const titleLink = safeStr(form.get("titleLink") || "", 255);
    const rating = toNum(form.get("rating"), 0);

    // НОВОЕ — артикль (SKU)
    const article = safeStr(form.get("article") || "", 64);

    // флаги
    const banner = toBool(form.get("banner"));
    const discounts = toBool(form.get("discounts"));
    const povsednevnaya = toBool(form.get("povsednevnaya"));
    const recommended = toBool(form.get("recommended"));

    // связи (id)
    const categoryId = toNullableInt(form.get("categoryId"));
    const subCategoryId = toNullableInt(form.get("subCategoryId"));
    const brandId = toNullableInt(form.get("brandId"));

    // строковые дубли (обратная совместимость)
    const category = safeStr(form.get("category") || "", 255);
    const subcategory = safeStr(form.get("subcategory") || "", 255);
    const brand = safeStr(form.get("brand") || "", 255);

    // info (JSON)
    const info = parseJsonSafe(form.get("info"), []);

    // изображения через URL
    const thumbnailUrl = safeStr(form.get("thumbnailUrl") || "", 1024);
    const imagesJson = parseJsonSafe(form.get("imagesJson"), []);
    const images = (Array.isArray(imagesJson) ? imagesJson : [])
      .map((it, idx) => ({
        url: safeStr(it?.url || "", 1024),
        sort: Number.isFinite(it?.sort) ? it.sort : idx,
      }))
      .filter((x) => x.url);

    if (!title) {
      return NextResponse.json({ ok: false, message: "Не передан title" }, { status: 400 });
    }
    if (!thumbnailUrl || images.length === 0) {
      return NextResponse.json({ ok: false, message: "Не переданы изображения" }, { status: 400 });
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
        rating,
        titleLink,
        content,
        banner,
        discounts,
        povsednevnaya,
        recommended,
        // НОВОЕ
        article,
        // изображения
        thumbnail: thumbnailUrl, // одна строка
        images,                  // JSON-массив [{url, sort}]
        // связи
        categoryId,
        subCategoryId,
        brandId,
        info,
      },
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/product error:", e);
    return NextResponse.json({ ok: false, message: "Ошибка при добавлении товара" }, { status: 500 });
  }
}

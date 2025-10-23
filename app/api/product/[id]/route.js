// /app/api/product/[id]/route.js — ГОТОВЫЙ ФАЙЛ (исправленное получение params через await)
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/* ========= helpers ========= */
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
function parseJsonSafe(v, def = []) {
  if (!v) return def;
  if (Array.isArray(v) || typeof v === "object") return v;
  try {
    return JSON.parse(v);
  } catch {
    return def;
  }
}
function safeStr(v, max = 1024) {
  if (v == null) return "";
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}
// Нормализуем относительный путь для БД
function normalizeRel(u) {
  if (!u) return "";
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (base && u.startsWith(base)) u = u.slice(base.length);
  if (!u.startsWith("/uploads/")) return `/uploads/products/${u.replace(/^\/+/, "")}`;
  return u;
}
// Приводим любое «старое» изображение к новому виду { url, sort }
function normalizeImagesArray(arr) {
  const a = parseJsonSafe(arr, []);
  const out = [];
  a.forEach((it, i) => {
    const url = it?.url || it?.image || (typeof it === "string" ? it : "");
    if (url) out.push({ url, sort: Number.isFinite(it?.sort) ? it.sort : i });
  });
  return out;
}

/* ========= Multer (только если пришли файлы) ========= */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.cwd(), "public/uploads/products"));
  },
  filename: (_req, _file, cb) => cb(null, uuidv4() + ".webp"),
});
const upload = multer({ storage });

/* ========= GET: один товар ========= */
export async function GET(_req, ctx) {
  try {
    const { id } = await ctx.params; // ← важно: await
    const item = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!item) return new NextResponse("Продукт по id не найден", { status: 404 });
    return NextResponse.json(item);
  } catch (e) {
    console.error("GET /api/product/[id] error:", e);
    return new NextResponse("Ошибка при получении товара по id", { status: 500 });
  }
}

/* ========= PUT: обновление ========= */
export async function PUT(req, ctx) {
  try {
    const { id } = await ctx.params; // ← важно: await

    // Сначала прогоняем через multer — даже если файлов нет, ошибок не будет.
    await new Promise((resolve, reject) => {
      upload.any()(req, {}, (err) => (err ? reject(err) : resolve()));
    });

    const form = await req.formData();

    // Базовые поля
    const title = safeStr(form.get("title"), 255);
    const description = String(form.get("description") || "");
    const price = toNum(form.get("price"), 0);
    const discountPercentage = toNum(form.get("discountPercentage"), 0);
    const stock = toNum(form.get("stock"), 0);
    const content = String(form.get("content") || "");
    const titleLink = safeStr(form.get("titleLink") || "", 255);
    const rating = toNum(form.get("rating"), 0);
    const article = safeStr(form.get("article") || "", 64);

    // Флаги
    const banner = toBool(form.get("banner"));
    const discounts = toBool(form.get("discounts"));
    const povsednevnaya = toBool(form.get("povsednevnaya"));
    const recommended = toBool(form.get("recommended"));

    // Связи
    const categoryId = toNullableInt(form.get("categoryId"));
    const subCategoryId = toNullableInt(form.get("subCategoryId"));
    const brandId = toNullableInt(form.get("brandId"));

    // Дубли строками (обратная совместимость)
    const category = safeStr(form.get("category") || "", 255);
    const subcategory = safeStr(form.get("subcategory") || "", 255);
    const brand = safeStr(form.get("brand") || "", 255);

    // Info (JSON)
    const info = parseJsonSafe(form.get("info"), []);

    // Достаём текущее состояние товара
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return new NextResponse("Продукт не найден", { status: 404 });

    // Определяем режим: URL-режим или файловый режим
    const hasUrlMode = form.has("thumbnailUrl") || form.has("imagesJson");

    let newThumbnail = product.thumbnail; // у нас сейчас хотим хранить просто строку-путь
    let newImages = normalizeImagesArray(product.images); // [{url, sort}]

    if (hasUrlMode) {
      // ====== URL-режим ======
      const thumbnailUrl = safeStr(form.get("thumbnailUrl") || "", 1024);
      const imagesJson = parseJsonSafe(form.get("imagesJson"), []);

      // Переписываем ВСЮ галерею в указанном порядке
      const mapped = imagesJson
        .map((it, idx) => ({
          url: normalizeRel(safeStr(it?.url || "", 1024)),
          sort: Number.isFinite(it?.sort) ? it.sort : idx,
        }))
        .filter((x) => x.url);

      if (!thumbnailUrl || mapped.length === 0) {
        return NextResponse.json({ ok: false, message: "Не переданы изображения" }, { status: 400 });
      }

      newThumbnail = normalizeRel(thumbnailUrl);
      newImages = mapped;
    } else {
      // ====== Файловый режим ======
      // Поддерживаем существующее + добавляем новые
      const formData = form;

      // Новое главное изображение
      const thumbFile = formData.get("thumbnail");
      if (thumbFile && typeof thumbFile === "object") {
        const fileName = uuidv4() + ".webp";
        const savePath = path.resolve(process.cwd(), "public/uploads/products", fileName);
        const buf = Buffer.from(await thumbFile.arrayBuffer());
        await fs.promises.writeFile(savePath, buf);
        newThumbnail = `/uploads/products/${fileName}`;
      }

      // Доп. изображения
      const imgFiles = formData.getAll("images") || [];
      for (const f of imgFiles) {
        if (!f || typeof f !== "object") continue;
        const fileName = uuidv4() + ".webp";
        const savePath = path.resolve(process.cwd(), "public/uploads/products", fileName);
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.promises.writeFile(savePath, buf);
        newImages.push({ url: `/uploads/products/${fileName}`, sort: newImages.length });
      }
    }

    const updated = await prisma.product.update({
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
        titleLink,
        content,
        banner,
        discounts,
        povsednevnaya,
        recommended,
        article,
        thumbnail: newThumbnail,   // ← ОДНА СТРОКА
        images: newImages,         // ← JSON-массив [{url, sort}]
        categoryId,
        subCategoryId,
        brandId,
        info,
      },
    });

    return NextResponse.json({ ok: true, message: "Продукт обновлён", item: updated });
  } catch (e) {
    console.error("PUT /api/product/[id] error:", e);
    return new NextResponse("Ошибка при обновлении товара", { status: 500 });
  }
}

/* ========= DELETE: удалить конкретную картинку ИЛИ целиком товар ========= */
/*
  Запросы:
  - DELETE /api/product/[id]?name=/uploads/products/xxx.webp   -> удалить ОДНО изображение
  - DELETE /api/product/[id]                                    -> удалить товар и все локальные файлы
*/
export async function DELETE(req, ctx) {
  try {
    const { id } = await ctx.params; // ← важно: await

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name"); // может быть 'xxx.webp' или '/uploads/products/xxx.webp'

    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return new NextResponse("Продукт не найден", { status: 404 });

    const normImages = normalizeImagesArray(product.images);

    if (name) {
      // Удаляем ОДНУ картинку из images, физически удаляем файл если он локальный
      const rel = name.startsWith("/uploads/")
        ? name.replace(/^\/uploads\//, "")           // products/xxx.webp
        : name.replace(/^\/+/, "");                  // xxx.webp или products/xxx.webp

      const toRemovePath = rel.startsWith("products/")
        ? rel
        : `products/${rel}`;

      const diskPath = path.resolve(process.cwd(), "public/uploads", toRemovePath);
      try { await fs.promises.unlink(diskPath); } catch {}

      const filtered = normImages.filter((it) => it.url !== `/uploads/${toRemovePath}`);

      // Если удалили то, что было thumbnail — сместим thumbnail на первую картинку (если есть)
      let newThumb = product.thumbnail;
      if (product.thumbnail === `/uploads/${toRemovePath}`) {
        newThumb = filtered[0]?.url || "";
      }

      await prisma.product.update({
        where: { id: Number(id) },
        data: { images: filtered, thumbnail: newThumb },
      });

      return new NextResponse("Изображение удалено!", { status: 200 });
    }

    // Полное удаление товара + локальные файлы
    const allUrls = [
      product.thumbnail,
      ...normImages.map((it) => it.url),
    ].filter(Boolean);

    for (const u of allUrls) {
      if (typeof u === "string" && u.startsWith("/uploads/products/")) {
        const disk = path.resolve(process.cwd(), "public", u.replace(/^\/+/, ""));
        try { await fs.promises.unlink(disk); } catch {}
      }
    }

    await prisma.product.delete({ where: { id: Number(id) } });
    return new NextResponse("Продукт удалён!", { status: 200 });
  } catch (e) {
    console.error("DELETE /api/product/[id] error:", e);
    return new NextResponse("Ошибка при удалении товара", { status: 500 });
  }
}

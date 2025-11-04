// /app/api/admin/categories/route.js — ПОЛНОСТЬЮ
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const c2t = new CyrillicToTranslit();

function makeSlug(name) {
  return c2t
    .transform(String(name || ""), "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .replace(/_+/g, "-")
    .toLowerCase();
}

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");
async function ensureUploadDir() {
  await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
}
async function saveWebpFile(file) {
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > 50 * 1024) throw new Error("IMAGE_TOO_LARGE");
  const fname = uuidv4() + ".webp";
  await fs.promises.writeFile(path.join(UPLOAD_DIR, fname), buf);
  return fname;
}
async function deleteIfExists(fname) {
  if (!fname) return;
  try {
    await fs.promises.unlink(path.join(UPLOAD_DIR, fname));
  } catch {}
}

function bad(msg, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

/* ✅ GET: список категорий */
export async function GET() {
  try {
    const items = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { subcategories: true },
    });
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error(e);
    return bad("Ошибка получения категорий", 500);
  }
}

/* ✅ POST: создать категорию (все поля обязательны, кроме contentHtml) */
export async function POST(req) {
  try {
    await ensureUploadDir();
    const formData = await req.formData();
    const name = String(formData.get("name") || "").trim();
    const h1 = String(formData.get("h1") || "").trim();
    const contentHtml = formData.get("contentHtml"); // может быть null
    const imageFile = formData.get("image");

    if (!name) return bad("Поле name обязательно");
    if (!h1) return bad("Поле h1 обязательно");
    if (!imageFile || typeof imageFile !== "object") {
      return bad("Изображение обязательно (WEBP до 50KB)");
    }

    const value = makeSlug(name);

    // Защита от дубликатов: по name или value
    const dup = await prisma.category.findFirst({
      where: { OR: [{ name }, { value }] },
      select: { id: true },
    });
    if (dup) return bad("Категория с таким названием уже существует");

    let image = null;
    try {
      image = await saveWebpFile(imageFile);
    } catch (err) {
      if (String(err?.message) === "IMAGE_TOO_LARGE") {
        return bad("Изображение больше 50KB");
      }
      throw err;
    }

    const created = await prisma.category.create({
      data: {
        name,
        value,
        h1,
        contentHtml: contentHtml === null ? null : String(contentHtml),
        image,
      },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    console.error(e);
    // Prisma уникальные ошибки
    if (e.code === "P2002") {
      return bad("Категория с таким названием или slug уже существует");
    }
    return bad("Ошибка создания категории", 500);
  }
}

/* ✅ PUT: обновить категорию (все поля обязательны, кроме contentHtml) */
export async function PUT(req) {
  try {
    await ensureUploadDir();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return bad("id обязателен");

    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) return bad("Категория не найдена", 404);

    const formData = await req.formData();
    const name = String(formData.get("name") || "").trim();
    const h1 = String(formData.get("h1") || "").trim();
    const contentHtml = formData.get("contentHtml"); // может быть null
    const imageFile = formData.get("image");

    if (!name) return bad("Поле name обязательно");
    if (!h1) return bad("Поле h1 обязательно");

    const value = makeSlug(name);

    // Дубликаты у других id
    const dup = await prisma.category.findFirst({
      where: { OR: [{ name }, { value }], NOT: { id } },
      select: { id: true },
    });
    if (dup) return bad("Категория с таким названием уже существует");

    let image = exists.image;
    if (imageFile && typeof imageFile === "object") {
      // заменяем старое изображение на новое (в системе всегда ОДНО)
      await deleteIfExists(exists.image);
      image = await saveWebpFile(imageFile);
    }

    const data = {
      name,
      value,
      h1,
      image,
    };
    if (contentHtml !== null) data.contentHtml = String(contentHtml);

    const updated = await prisma.category.update({ where: { id }, data });

    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    console.error(e);
    if (e.code === "P2002") {
      return bad("Категория с таким названием или slug уже существует");
    }
    return bad("Ошибка обновления категории", 500);
  }
}

/* ✅ DELETE */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return bad("id обязателен");

    const exists = await prisma.category.findUnique({ where: { id } });
    if (exists?.image) await deleteIfExists(exists.image);

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return bad("Ошибка удаления категории", 500);
  }
}

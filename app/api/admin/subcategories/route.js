// /app/api/admin/subcategories/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
  try {
    await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {}
}

async function saveWebpFile(file) {
  if (!file || typeof file !== "object") return null;
  const arrayBuf = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuf);
  if (buf.length > 50 * 1024) {
    throw new Error("IMAGE_TOO_LARGE");
  }
  const fname = uuidv4() + ".webp";
  const fpath = path.join(UPLOAD_DIR, fname);
  await fs.promises.writeFile(fpath, buf);
  return fname;
}

async function deleteIfExists(filename) {
  if (!filename) return;
  const fpath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.promises.unlink(fpath);
  } catch {}
}

// GET: список или фильтр по categoryId / value
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const value = searchParams.get("value");

    const where = {};
    if (categoryId) where.categoryId = Number(categoryId);
    if (value) where.value = String(value);

    const items = await prisma.subCategory.findMany({
      where,
      orderBy: [{ categoryId: "asc" }, { name: "asc" }],
      include: { category: true },
    });

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Ошибка получения подкатегорий" },
      { status: 500 }
    );
  }
}

// POST: создать (multipart/form-data)
export async function POST(req) {
  try {
    await ensureUploadDir();
    const formData = await req.formData();

    const name = formData.get("name");
    const h1 = formData.get("h1") || null;
    const contentHtml = formData.get("contentHtml") || null;
    const categoryId = Number(formData.get("categoryId"));
    const imageFile = formData.get("image");

    if (!name || !categoryId) {
      return NextResponse.json(
        { ok: false, error: "name и categoryId обязательны" },
        { status: 400 }
      );
    }

    const value = makeSlug(name);

    let image = null;
    if (imageFile && typeof imageFile === "object") {
      try {
        image = await saveWebpFile(imageFile);
      } catch (err) {
        if (String(err?.message) === "IMAGE_TOO_LARGE") {
          return NextResponse.json(
            { ok: false, error: "Изображение больше 50KB" },
            { status: 400 }
          );
        }
        throw err;
      }
    }

    const created = await prisma.subCategory.create({
      data: {
        name,
        value,
        categoryId,
        h1,
        contentHtml,
        image,
      },
      include: { category: true },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Ошибка создания подкатегории" },
      { status: 500 }
    );
  }
}

// DELETE: удалить (и картинку, если есть)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id)
      return NextResponse.json(
        { ok: false, error: "id обязателен" },
        { status: 400 }
      );

    const exists = await prisma.subCategory.findUnique({ where: { id } });
    if (exists?.image) {
      await deleteIfExists(exists.image);
    }

    await prisma.subCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Ошибка удаления подкатегории (есть зависимые записи?)" },
      { status: 500 }
    );
  }
}

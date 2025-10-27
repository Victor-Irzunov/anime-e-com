// /app/api/admin/categories/route.js
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
    return NextResponse.json(
      { ok: false, error: "Ошибка получения категорий" },
      { status: 500 }
    );
  }
}

/* ✅ POST: создать категорию */
export async function POST(req) {
  try {
    await ensureUploadDir();
    const formData = await req.formData();
    const name = formData.get("name");
    const h1 = formData.get("h1") || null;
    const contentHtml = formData.get("contentHtml") || null;
    const imageFile = formData.get("image");

    if (!name)
      return NextResponse.json(
        { ok: false, error: "name обязателен" },
        { status: 400 }
      );

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

    const created = await prisma.category.create({
      data: {
        name,
        value,
        h1,
        contentHtml,
        image,
      },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Ошибка создания категории" },
      { status: 500 }
    );
  }
}

/* ✅ PUT: обновить категорию */
export async function PUT(req) {
  try {
    await ensureUploadDir();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id)
      return NextResponse.json(
        { ok: false, error: "id обязателен" },
        { status: 400 }
      );

    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists)
      return NextResponse.json(
        { ok: false, error: "Категория не найдена" },
        { status: 404 }
      );

    const formData = await req.formData();
    const name = formData.get("name");
    const h1 = formData.get("h1") || null;
    const contentHtml = formData.get("contentHtml");
    const imageFile = formData.get("image");

    if (!name)
      return NextResponse.json(
        { ok: false, error: "name обязателен" },
        { status: 400 }
      );

    const value = makeSlug(name);

    let image = exists.image;
    if (imageFile && typeof imageFile === "object") {
      await deleteIfExists(exists.image);
      image = await saveWebpFile(imageFile);
    }

    const data = {
      name,
      value,
      h1,
      image,
    };
    if (contentHtml !== null) data.contentHtml = contentHtml;

    const updated = await prisma.category.update({ where: { id }, data });

    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Ошибка обновления" },
      { status: 500 }
    );
  }
}

/* ✅ DELETE */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id)
      return NextResponse.json(
        { ok: false, error: "id обязателен" },
        { status: 400 }
      );

    const exists = await prisma.category.findUnique({ where: { id } });
    if (exists?.image) await deleteIfExists(exists.image);

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Ошибка удаления" },
      { status: 500 }
    );
  }
}

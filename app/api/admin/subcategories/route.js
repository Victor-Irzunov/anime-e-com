import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const c2t = new CyrillicToTranslit();
function makeSlug(txt) {
  return c2t
    .transform(String(txt || ""), "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .replace(/_+/g, "-")
    .toLowerCase();
}

const DIR = path.resolve(process.cwd(), "public/uploads");
async function ensureDir() {
  await fs.promises.mkdir(DIR, { recursive: true });
}
async function saveImg(blob) {
  const buf = Buffer.from(await blob.arrayBuffer());
  if (buf.length > 50 * 1024) throw new Error("IMG_TOO_LARGE");
  const fname = uuidv4() + ".webp";
  await fs.promises.writeFile(path.join(DIR, fname), buf);
  return fname;
}
async function delImg(name) {
  if (!name) return;
  try {
    await fs.promises.unlink(path.join(DIR, name));
  } catch {}
}

function bad(msg, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

/* ✅ GET — поддерживает фильтры:
   - ?categoryId=1
   - ?value=nedoroids
   - ?value=...&category=... (оба slug)
*/
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryIdParam = searchParams.get("categoryId");
    const valueParam = searchParams.get("value");
    const categoryValueParam = searchParams.get("category");

    if (valueParam) {
      const where = {
        value: String(valueParam),
        ...(categoryValueParam ? { category: { value: String(categoryValueParam) } } : {}),
      };
      const item = await prisma.subCategory.findFirst({
        where,
        include: { category: true },
      });
      return NextResponse.json({ ok: true, items: item ? [item] : [] });
    }

    const where = categoryIdParam ? { categoryId: Number(categoryIdParam) } : {};
    const items = await prisma.subCategory.findMany({
      where,
      orderBy: [{ categoryId: "asc" }, { name: "asc" }],
      include: { category: true },
    });
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error(e);
    return bad("Ошибка получения подкатегорий", 500);
  }
}

/* ✅ POST — создать подкатегорию (все поля обязательны, кроме contentHtml) */
export async function POST(req) {
  try {
    await ensureDir();
    const form = await req.formData();

    const name = String(form.get("name") || "").trim();
    const categoryId = Number(form.get("categoryId"));
    const h1 = String(form.get("h1") || "").trim();
    const contentHtml = form.get("contentHtml"); // может быть null
    const file = form.get("image");

    if (!name) return bad("Поле name обязательно");
    if (!categoryId) return bad("Поле categoryId обязательно");
    if (!h1) return bad("Поле h1 обязательно");
    if (!file || typeof file !== "object") {
      return bad("Изображение обязательно (WEBP до 50KB)");
    }

    const value = makeSlug(name);

    // Проверка на дубликаты в рамках категории — по name или value
    const dup = await prisma.subCategory.findFirst({
      where: { categoryId, OR: [{ name }, { value }] },
      select: { id: true },
    });
    if (dup) return bad("Подкатегория с таким названием уже существует в выбранной категории");

    let image = null;
    try {
      image = await saveImg(file);
    } catch (e) {
      if (String(e?.message) === "IMG_TOO_LARGE") return bad("Картинка больше 50KB");
      throw e;
    }

    const created = await prisma.subCategory.create({
      data: {
        name,
        value,
        categoryId,
        h1,
        contentHtml: contentHtml === null ? null : String(contentHtml),
        image,
      },
      include: { category: true },
    });
    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    console.error(e);
    if (e.code === "P2002") {
      return bad("Такая подкатегория уже существует");
    }
    return bad("Ошибка создания подкатегории", 500);
  }
}

/* ✅ PUT — обновить подкатегорию (все поля обязательны, кроме contentHtml) */
export async function PUT(req) {
  try {
    await ensureDir();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return bad("id обязателен");

    const existing = await prisma.subCategory.findUnique({ where: { id } });
    if (!existing) return bad("Подкатегория не найдена", 404);

    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const categoryId = Number(form.get("categoryId"));
    const h1 = String(form.get("h1") || "").trim();
    const contentHtml = form.get("contentHtml");
    const file = form.get("image");

    if (!name) return bad("Поле name обязательно");
    if (!categoryId) return bad("Поле categoryId обязательно");
    if (!h1) return bad("Поле h1 обязательно");

    const value = makeSlug(name);

    // Проверка на дубликаты в рамках категории среди других id
    const dup = await prisma.subCategory.findFirst({
      where: { categoryId, OR: [{ name }, { value }], NOT: { id } },
      select: { id: true },
    });
    if (dup) return bad("Подкатегория с таким названием уже существует в выбранной категории");

    let image = existing.image;
    if (file && typeof file === "object") {
      await delImg(existing.image);
      image = await saveImg(file);
    }

    const data = { name, value, categoryId, h1, image };
    if (contentHtml !== null) data.contentHtml = String(contentHtml);

    const updated = await prisma.subCategory.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return bad("Такая подкатегория уже существует");
    }
    return bad("Ошибка обновления подкатегории", 500);
  }
}

/* ✅ DELETE */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return bad("id обязателен");

    const existing = await prisma.subCategory.findUnique({ where: { id } });
    if (existing?.image) await delImg(existing.image);

    await prisma.subCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return bad("Ошибка удаления подкатегории", 500);
  }
}

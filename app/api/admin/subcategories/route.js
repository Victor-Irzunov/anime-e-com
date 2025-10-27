// /app/api/admin/subcategories/route.js
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

/* ✅ GET — полностью рабочий */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const where = categoryId ? { categoryId: Number(categoryId) } : {};

    const items = await prisma.subCategory.findMany({
      where,
      orderBy: [{ categoryId: "asc" }, { name: "asc" }],
      include: { category: true },
    });
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false });
  }
}

/* ✅ POST — без изменений */
export async function POST(req) {
  try {
    await ensureDir();
    const form = await req.formData();

    const name = form.get("name");
    const categoryId = Number(form.get("categoryId"));
    const h1 = form.get("h1") || null;
    const contentHtml = form.get("contentHtml") || null;
    const file = form.get("image");

    if (!name || !categoryId)
      return NextResponse.json({ ok: false, error: "name/categoryId" });

    const value = makeSlug(name);
    let image = null;
    if (file && typeof file === "object") image = await saveImg(file);

    const created = await prisma.subCategory.create({
      data: { name, value, categoryId, h1, contentHtml, image },
      include: { category: true },
    });
    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false });
  }
}

/* ✅ PUT — новая логика обновления */
export async function PUT(req) {
  try {
    await ensureDir();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, error: "id" });

    const existing = await prisma.subCategory.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ ok: false, error: "not found" });

    const form = await req.formData();
    const name = form.get("name");
    const categoryId = Number(form.get("categoryId"));
    const h1 = form.get("h1") || null;
    const contentHtml = form.get("contentHtml");
    const file = form.get("image");

    const value = makeSlug(name);

    let image = existing.image;
    if (file && typeof file === "object") {
      await delImg(existing.image);
      image = await saveImg(file);
    }

    const data = { name, value, categoryId, h1, image };
    if (contentHtml !== null) data.contentHtml = contentHtml;

    const updated = await prisma.subCategory.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false });
  }
}

/* ✅ DELETE без изменений */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const existing = await prisma.subCategory.findUnique({ where: { id } });
    if (existing?.image) await delImg(existing.image);

    await prisma.subCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false });
  }
}

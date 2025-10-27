// /app/api/admin/brands/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import CyrillicToTranslit from "cyrillic-to-translit-js";

const prisma = new PrismaClient();
const c2t = new CyrillicToTranslit();

function slugifyName(name) {
  const base = c2t
    .transform(String(name || ""), "_")
    .replace(/[^a-zA-Z0-9_]/g, "");

  return base.toLowerCase().replace(/_+/g, "-");
}

export async function GET() {
  try {
    const items = await prisma.brand.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    if (!name)
      return NextResponse.json({ ok: false, error: "Название обязательно" }, { status: 400 });

    const value = slugifyName(name);
    const created = await prisma.brand.create({
      data: { name, value },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const id = Number(body.id);
    const name = body.name?.trim();

    if (!id || !name)
      return NextResponse.json({ ok: false, error: "id и name обязательны" }, { status: 400 });

    const value = slugifyName(name);
    const updated = await prisma.brand.update({
      where: { id },
      data: { name, value },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false });

    await prisma.brand.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

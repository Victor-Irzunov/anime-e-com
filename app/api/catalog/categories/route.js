// /app/api/catalog/categories/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { subcategories: { orderBy: { name: "asc" } } },
    });
    return NextResponse.json({ ok: true, items: cats });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// /app/api/public/navigation/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Публичное API для навигации (категории + подкатегории)
 * GET /api/public/navigation
 * Возвращает: [{ id,name,value, subcategories:[{id,name,value}] }]
 */
export async function GET() {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        value: true,
        subcategories: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, value: true },
        },
      },
    });

    return NextResponse.json({ ok: true, items: cats }, { status: 200 });
  } catch (e) {
    console.error("GET /api/public/navigation error:", e);
    return NextResponse.json({ ok: false, error: "Ошибка загрузки навигации" }, { status: 500 });
  }
}

// /app/api/admin/products/search/route.js — ИСПРАВЛЕНИЕ: убран mode, всё остальное сохранено
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const qRaw = (searchParams.get("q") || "").trim();
    const takeParam = parseInt(searchParams.get("take") || "20", 10);
    const take = Math.max(1, Math.min(takeParam, 50));
    const cursorParam = searchParams.get("cursor");
    const cursor = cursorParam ? Number(cursorParam) : null;

    // Разрешаем искать с 1 символа
    if (!qRaw || qRaw.length < 1) {
      return NextResponse.json({ ok: true, items: [], nextCursor: null });
    }

    // Токенизация: "nike air 90" -> ["nike","air","90"]
    const tokens = qRaw
      .split(/[,\s]+/g)
      .map((t) => t.trim())
      .filter(Boolean);

    // Вспомогалки (БЕЗ mode)
    const andContains = (field) => tokens.map((t) => ({ [field]: { contains: t } }));
    const andStarts   = (field) => tokens.map((t) => ({ [field]: { startsWith: t } }));

    const or = [];

    // Чисто цифры — точное совпадение по id
    if (/^\d+$/.test(qRaw)) {
      or.push({ id: Number(qRaw) });
    }

    // По названию
    if (tokens.length) {
      or.push({ AND: andStarts("title") });
      or.push({ AND: andContains("title") });
    }

    // По артикулу
    if (tokens.length) {
      or.push({ AND: andStarts("article") });
      or.push({ AND: andContains("article") });
    }

    // По ЧПУ
    if (tokens.length) {
      or.push({ AND: andContains("titleLink") });
    }

    // По бренду/категории/подкатегории
    if (tokens.length) {
      or.push({ AND: andStarts("brand") });
      or.push({ AND: andStarts("category") });
      or.push({ AND: andStarts("subcategory") });
    }

    const where = or.length ? { OR: or } : undefined;

    const items = await prisma.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        article: true,
        price: true,
        stock: true,
        brand: true,
        category: true,
        subcategory: true,
        thumbnail: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: take + 1, // +1 чтобы понять, есть ли следующая страница
    });

    let nextCursor = null;
    if (items.length > take) {
      const next = items.pop();
      nextCursor = next.id;
    }

    return NextResponse.json({ ok: true, items, nextCursor });
  } catch (e) {
    console.error("SEARCH_FAILED", e);
    return NextResponse.json({ ok: false, error: "SEARCH_FAILED" }, { status: 500 });
  }
}

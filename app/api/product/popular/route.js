// /app/api/product/popular/route.js
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
    const takeParam = parseInt(searchParams.get("take") || "24", 10);
    const take = Math.max(1, Math.min(takeParam, 60));

    // ⚠️ «Популярные» в UI соответствует полю БД `povsednevnaya`
    const items = await prisma.product.findMany({
      where: { povsednevnaya: true },
      select: {
        id: true,
        title: true,
        titleLink: true,
        article: true,
        price: true,
        stock: true,
        brand: true,
        thumbnail: true,
        category: true,
        subcategory: true,
        categoryRel: { select: { id: true, name: true, value: true } },
        subCategoryRel: { select: { id: true, name: true, value: true } },
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take,
    });

    const normalized = items.map((p) => ({
      id: p.id,
      title: p.title,
      titleLink: p.titleLink,
      article: p.article,
      price: p.price,
      stock: p.stock,
      brand: p.brand,
      thumbnail: p.thumbnail,
      categoryName:     p.categoryRel?.name || p.category || null,
      categoryValue:    p.categoryRel?.value || p.category || null,
      subcategoryName:  p.subCategoryRel?.name || p.subcategory || null,
      subcategoryValue: p.subCategoryRel?.value || p.subcategory || null,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ ok: true, items: normalized });
  } catch (e) {
    console.error("POPULAR_FAILED", e);
    return NextResponse.json({ ok: false, error: "POPULAR_FAILED" }, { status: 500 });
  }
}

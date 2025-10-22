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
    const takeParam = parseInt(searchParams.get("take") || "30", 10);
    const take = Math.max(1, Math.min(takeParam, 60));

    if (!qRaw) {
      return NextResponse.json({ ok: true, items: [], nextCursor: null });
    }

    // токены: пробел/запятая
    const tokens = qRaw
      .split(/[,\s]+/g)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);

    // для КАЖДОГО токена — OR по наборам полей
    const AND = tokens.map((t) => ({
      OR: [
        { title:       { contains: t } },
        { article:     { contains: t } },
        { brand:       { contains: t } },
        { category:    { contains: t } },      // если строковые слуги ещё заполнены
        { subcategory: { contains: t } },
        { titleLink:   { contains: t } },

        // По связям (Category / SubCategory)
        { categoryRel: {
            is: {
              OR: [
                { value: { contains: t } },
                { name:  { contains: t } },
              ],
            },
        }},
        { subCategoryRel: {
            is: {
              OR: [
                { value: { contains: t } },
                { name:  { contains: t } },
              ],
            },
        }},
      ],
    }));

    const where = { AND };

    const rows = await prisma.product.findMany({
      where,
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
        categoryRel:    { select: { id: true, name: true, value: true } },
        subCategoryRel: { select: { id: true, name: true, value: true } },
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take,
    });

    // нормализуем плоские слуги/названия для фронта
    const items = rows.map((p) => ({
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

    return NextResponse.json({ ok: true, items, nextCursor: null });
  } catch (e) {
    console.error("SEARCH_FAILED", e);
    return NextResponse.json({ ok: false, error: "SEARCH_FAILED" }, { status: 500 });
  }
}

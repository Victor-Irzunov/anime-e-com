import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

/**
 * GET /api/admin/products/by-cat?categoryId=..&subCategoryId=..&brandId=..
 * Возвращает товары по выбранным ID (при наличии связей).
 * Если в некоторых записях связи пустые — подстрахуемся фильтрами по строковым дублям.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = Number(searchParams.get("categoryId") || "");
    const subCategoryId = Number(searchParams.get("subCategoryId") || "");
    const brandId = Number(searchParams.get("brandId") || "");

    if (!Number.isFinite(categoryId) || !Number.isFinite(subCategoryId)) {
      return NextResponse.json({ ok: false, message: "categoryId и subCategoryId обязательны" }, { status: 400 });
    }

    // Базовый where по id связям
    const where = {
      AND: [
        { OR: [{ categoryId: categoryId }, { categoryId: null }] },
        { OR: [{ subCategoryId: subCategoryId }, { subCategoryId: null }] },
      ],
    };

    if (Number.isFinite(brandId) && brandId > 0) {
      where.AND.push({ OR: [{ brandId: brandId }, { brandId: null }] });
    }

    // Найдём строковые дубли по справочникам (для страховки)
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    const sub = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
    const br = Number.isFinite(brandId) && brandId > 0 ? await prisma.brand.findUnique({ where: { id: brandId } }) : null;

    if (cat?.name) {
      where.AND.push({ category: { equals: cat.name } });
    }
    if (sub?.name) {
      where.AND.push({ subcategory: { equals: sub.name } });
    }
    if (br?.name) {
      where.AND.push({ brand: { equals: br.name } });
    }

    const items = await prisma.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        discountPercentage: true,
        stock: true,
        brand: true,
        category: true,
        subcategory: true,
        thumbnail: true,
        images: true,
        info: true,
        rating: true,
        content: true,
        article: true,
        titleLink: true,
        banner: true,
        discounts: true,
        povsednevnaya: true,
        recommended: true,
        createdAt: true,
        // связи — чтобы подставить id в форму
        categoryId: true,
        subCategoryId: true,
        brandId: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 200,
    });

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("GET /by-cat error:", e);
    return new NextResponse("Ошибка при получении списка", { status: 500 });
  }
}

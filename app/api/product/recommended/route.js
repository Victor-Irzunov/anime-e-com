// /app/api/product/recommended/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const brandIdParam = searchParams.get("brandId");
    const brandName = (searchParams.get("brandName") || "").trim();
    const excludeIdParam = searchParams.get("excludeId");
    const takeParam = parseInt(searchParams.get("take") || "10", 10);

    const brandId = brandIdParam ? Number(brandIdParam) : null;
    const excludeId = excludeIdParam ? Number(excludeIdParam) : null;
    const take = Math.max(1, Math.min(Number.isFinite(takeParam) ? takeParam : 10, 20));

    // Без фильтра бренда — пусто (чтобы не тянуть весь каталог)
    if (!brandId && !brandName) {
      return NextResponse.json({ ok: true, items: [] });
    }

    let whereBrand;
    if (brandId) {
      whereBrand = { brandId };
    } else {
      // пробуем найти brand.id по имени (точное совпадение с учётом вашей коллации)
      const b = await prisma.brand.findFirst({
        where: { name: brandName },
        select: { id: true },
      });
      whereBrand = b
        ? { brandId: b.id }
        : { brand: brandName }; // фолбэк к строковому полю в Product
    }

    // Основной запрос
    let rows = await prisma.product.findMany({
      where: {
        ...whereBrand,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        categoryRel: { select: { value: true } },
        subCategoryRel: { select: { value: true } },
        brandRel: { select: { id: true, name: true } },
      },
    });

    // Фолбэк по категории текущего товара, если по бренду пусто
    if ((!rows || rows.length === 0) && excludeId) {
      const current = await prisma.product.findUnique({
        where: { id: excludeId },
        select: { categoryId: true, subCategoryId: true },
      });

      if (current?.categoryId) {
        rows = await prisma.product.findMany({
          where: {
            categoryId: current.categoryId,
            ...(current.subCategoryId ? { subCategoryId: current.subCategoryId } : {}),
            id: { not: excludeId },
          },
          orderBy: { createdAt: "desc" },
          take,
          include: {
            categoryRel: { select: { value: true } },
            subCategoryRel: { select: { value: true } },
            brandRel: { select: { id: true, name: true } },
          },
        });
      }
    }

    const items = (rows || []).map((p) => ({
      ...p,
      categoryValue: p.categoryRel?.value ?? null,
      subcategoryValue: p.subCategoryRel?.value ?? null,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("GET /api/product/recommended error:", e);
    return NextResponse.json({ ok: false, message: "Ошибка получения рекомендованных товаров" }, { status: 500 });
  }
}

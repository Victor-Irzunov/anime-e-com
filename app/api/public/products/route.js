// /app/api/public/products/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function safeParseJson(val, fallback) {
  if (Array.isArray(val) || typeof val === "object") return val ?? fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || "";
    const subcategorySlug = searchParams.get("subcategory") || "";

    let where = {};
    let cat = null;
    let sub = null;

    if (categorySlug) {
      cat = await prisma.category.findFirst({ where: { value: categorySlug } });
      if (cat) {
        where = {
          OR: [
            { categoryId: cat.id },
            { category: cat.name }, // fallback по старому строковому полю
          ],
        };
      }
    }

    if (subcategorySlug) {
      sub = await prisma.subCategory.findFirst({
        where: { value: subcategorySlug, ...(cat ? { categoryId: cat.id } : {}) },
      });
      if (sub) {
        where = {
          OR: [
            { subCategoryId: sub.id },
            { subcategory: sub.name }, // fallback
          ],
        };
      }
    }

    const rows = await prisma.product.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        categoryRel: { select: { name: true, value: true } },
        subCategoryRel: { select: { name: true, value: true } },
        brandRel: { select: { name: true, value: true } },
      },
    });

    const items = rows.map((p) => {
      const images = safeParseJson(p.images, []);
      const info = safeParseJson(p.info, []);
      const thumbnail =
        typeof p.thumbnail === "string"
          ? p.thumbnail
          : (p.thumbnail && p.thumbnail.url) || "";

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,

        // отображение
        brand: p.brandRel?.name || p.brand || "",
        brandValue: p.brandRel?.value || null,

        category: p.categoryRel?.name || p.category || "",
        categoryValue: p.categoryRel?.value || null,

        subcategory: p.subCategoryRel?.name || p.subcategory || "",
        subcategoryValue: p.subCategoryRel?.value || null,

        titleLink: p.titleLink,

        thumbnail,      // ОДНА строка-путь к картинке
        images,         // массив объектов [{url, sort}]
        info,           // массив [{property, value}]
        content: p.content,

        // на будущее
        metaTitle: p.metaTitle,
        metaDesc: p.metaDesc,
        h1: p.h1,
      };
    });

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("public/products GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

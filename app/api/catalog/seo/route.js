// /app/api/catalog/seo/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ?category=slug | ?subcategory=slug
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    if (subcategory) {
      const sub = await prisma.subCategory.findFirst({
        where: { value: subcategory },
        include: { category: true },
      });
      if (!sub) return NextResponse.json({ ok: false }, { status: 404 });
      return NextResponse.json({
        ok: true,
        type: "subcategory",
        data: {
          h1: sub.h1 || sub.name,
          metaTitle: sub.metaTitle || sub.name,
          metaDesc: sub.metaDesc || "",
          contentHtml: sub.contentHtml || "",
          categoryValue: sub.category.value,
          subcategoryValue: sub.value,
        },
      });
    }

    if (category) {
      const cat = await prisma.category.findFirst({
        where: { value: category },
      });
      if (!cat) return NextResponse.json({ ok: false }, { status: 404 });
      return NextResponse.json({
        ok: true,
        type: "category",
        data: {
          h1: cat.h1 || cat.name,
          metaTitle: cat.metaTitle || cat.name,
          metaDesc: cat.metaDesc || "",
          contentHtml: cat.contentHtml || "",
          categoryValue: cat.value,
        },
      });
    }

    return NextResponse.json({ ok: false, error: "Bad query" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// /app/api/public/breadcrumbs/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPath = searchParams.get("path") || "/";
    const segments = decodeURIComponent(rawPath)
      .split("?")[0]
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean);

    const items = [{ name: "Главная", url: "/" }];

    if (segments.length === 0) {
      return NextResponse.json({ ok: true, items });
    }

    // /:category
    const catSlug = segments[0];
    const cat = await prisma.category.findFirst({ where: { value: catSlug } });
    if (cat) {
      items.push({ name: cat.name, url: `/${cat.value}` });
    } else {
      // если нет в базе — просто показываем сегмент
      items.push({ name: catSlug, url: `/${catSlug}` });
    }

    // /:category/:subcategory
    if (segments.length >= 2) {
      const subSlug = segments[1];
      let sub = null;
      if (cat) {
        sub = await prisma.subCategory.findFirst({
          where: { value: subSlug, categoryId: cat.id },
        });
      } else {
        sub = await prisma.subCategory.findFirst({ where: { value: subSlug } });
      }
      if (sub) {
        items.push({ name: sub.name, url: `/${cat?.value || catSlug}/${sub.value}` });
      } else {
        items.push({ name: subSlug, url: `/${cat?.value || catSlug}/${subSlug}` });
      }
    }

    // /:category/:subcategory/:titleLink
    if (segments.length >= 3) {
      const titleLink = segments[2];
      const prod = await prisma.product.findFirst({
        where: { titleLink },
      });
      items.push({
        name: prod?.h1 || prod?.title || titleLink,
        url: `/${segments.slice(0, 3).join("/")}`,
      });
    }

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("breadcrumbs error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

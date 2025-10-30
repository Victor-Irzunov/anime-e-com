import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },          // ← кол-во товаров в категории
        subcategories: { orderBy: { name: "asc" } },
      },
    });

    // можно вернуть как есть (_count.products), но продублируем удобное поле
    const items = cats.map((c) => ({
      ...c,
      productsCount: c._count?.products ?? 0,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// /app/api/admin/orders/[id]/route.js — ЗАМЕНИ ФАЙЛ ПОЛНОСТЬЮ
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH /api/admin/orders/[id] — смена статуса
export async function PATCH(req, ctx) {
  try {
    const { id } = await ctx.params; // ← важно: await
    const orderId = Number(id);
    if (!orderId || Number.isNaN(orderId)) {
      return new NextResponse("Некорректный id", { status: 400 });
    }

    const body = await req.json();
    const nextStatus = String(body?.status || "NEW");

    const upd = await prisma.orderData.update({
      where: { id: orderId },
      data: { status: nextStatus },
    });

    return NextResponse.json(
      { ok: true, id: upd.id, status: upd.status },
      { status: 200 }
    );
  } catch (e) {
    console.error("PATCH /api/admin/orders/[id] error:", e);
    return new NextResponse("Ошибка обновления статуса", { status: 500 });
  }
}

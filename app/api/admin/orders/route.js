// /app/api/admin/orders/route.js — СОЗДАЙ ФАЙЛ ПОЛНОСТЬЮ
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/orders — список заказов (для админа)
export async function GET() {
  try {
    const orders = await prisma.orderData.findMany({
      include: {
        user: {
          include: { userData: true }, // подтянем профиль пользователя
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // нормализуем структуру и подстрахуем поля
    const result = orders.map((o) => {
      let items = [];
      try {
        if (Array.isArray(o.orderItems)) items = o.orderItems;
        else if (o.orderItems?.data) items = o.orderItems.data;
        else if (typeof o.orderItems === "string") items = JSON.parse(o.orderItems);
      } catch {
        items = [];
      }
      return {
        ...o,
        // подстрахуем статус — если колонки нет/пусто, пусть будет "NEW"
        status: o.status || "NEW",
        // добавим email на верхний уровень (если храните в заказе — возьмётся оттуда, иначе из пользователя)
        email: o.email || o.user?.email || null,
        // для совместимости с фронтом: userData прямо на корне (из user.userData)
        userData: o.user?.userData || null,
        orderItems: items,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("GET /api/admin/orders error:", e);
    return new NextResponse("Ошибка получения заказов", { status: 500 });
  }
}

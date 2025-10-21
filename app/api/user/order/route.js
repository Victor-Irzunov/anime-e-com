// /app/api/user/order/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("id"));

    const orderData = await prisma.orderData.findMany({
      where: { userId },
      include: { user: true },
    });

    // Всегда 200, даже если пусто
    return NextResponse.json(Array.isArray(orderData) ? orderData : [], { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении заказов пользователя:', error);
    return new NextResponse('Серверная ошибка при получении заказов пользователя', { status: 500 });
  }
}

// /app/api/orders/route.js — СОЗДАЙ/ОБНОВИ
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.orderData.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (e) {
    console.error(e);
    return new NextResponse('Ошибка получения заказов', { status: 500 });
  }
}

// /app/api/orders/[id]/route.js — СОЗДАЙ/ОБНОВИ
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { status } = body;
    const order = await prisma.orderData.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(order, { status: 200 });
  } catch (e) {
    console.error(e);
    return new NextResponse('Ошибка обновления статуса', { status: 500 });
  }
}

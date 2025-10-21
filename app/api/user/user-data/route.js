// /app/api/user/user-data/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("id"));

    const userData = await prisma.userData.findUnique({ where: { userId } });

    // БЫЛО: 404 — плохо для фронта
    // СТАЛО: 200 и null
    return NextResponse.json(userData ?? null, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return new NextResponse('Серверная ошибка при получении данных пользователя', { status: 500 });
  }
}

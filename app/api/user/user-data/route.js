import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, res) {
    try {
        const { searchParams } = new URL(req.url)
        const userId = parseInt(searchParams.get("id"));

        // Получение данных пользователя
        const userData = await prisma.userData.findUnique({
            where: { userId },
        });

        if (!userData) {
            return new NextResponse('Данные пользователя не найдены', { status: 404 });
        }

        return NextResponse.json(userData);
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return new NextResponse('Серверная ошибка при получении данных пользователя', { status: 500 });
    }
}

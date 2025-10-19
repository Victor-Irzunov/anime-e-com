import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, res) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = parseInt(searchParams.get("id"));

        // Получаем все заказы пользователя
        const orderData = await prisma.orderData.findMany({
            where: { userId },
            include: { user: true } 
        });
        
        if (!orderData) {
            return new NextResponse('Заказы пользователя не найдены', { status: 404 });
        }

        return NextResponse.json(orderData);
    } catch (error) {
        console.error('Ошибка при получении заказов пользователя:', error);
        return new NextResponse('Серверная ошибка при получении заказов пользователя', { status: 500 });
    }
}

import { PrismaClient, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const formData = await req.formData();
        const orderData = JSON.parse(formData.get('orderData'));
        const orderItems = JSON.parse(orderData.orderItems);
        // Проверка существования данных пользователя
        const existingUserData = await prisma.userData.findUnique({
            where: { userId: orderData.userId },
        });

		 let userData;
		 
		 const order = await prisma.orderData.create({
			data: {
				 user: { connect: { id: orderData.userId } },
				 message: orderData.message,
				 address: orderData.address,
				 phone: orderData.phone,
				 orderItems: { data: orderItems },
			},
	  });
        // Если данные пользователя уже существуют, обновляем их
        if (existingUserData) {
            userData = await prisma.userData.update({
                where: { userId: orderData.userId },
                data: {
                    name: orderData.name,
                    surname: orderData.surname,
                    address: orderData.address,
                    phone: orderData.phone,
                    orderId: order.id
                },
            });
        } else {
            // Если данных пользователя нет, создаем новую запись
            userData = await prisma.userData.create({
                data: {
                    user: { connect: { id: orderData.userId } },
                    name: orderData.name,
                    surname: orderData.surname,
                    address: orderData.address,
                    phone: orderData.phone,
                    orderId: order.id
                },
            });
        }
        return new NextResponse("Заказ успешно сохранен", { status: 200 });
    } catch (error) {
        console.error('Ошибка при сохранении заказа:', error);
        return new NextResponse("Ошибка при сохранении заказа", { status: 500 });
    }
}

// /app/api/product/order/route.js — ЗАМЕНИ ПОЛНОСТЬЮ
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const orderData = JSON.parse(formData.get('orderData'));
    const orderItems = JSON.parse(orderData.orderItems || '[]');

    // 1) Находим/создаём пользователя по email
    let user = await prisma.user.findUnique({ where: { email: orderData.email } });

    // Генерируем токен на установку пароля, TTL 24h
    const token = generateResetToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: orderData.email,
          password: null,       // нет пароля
          isAdmin: false,
          isGuest: true,
          passwordResetToken: token,
          passwordResetExpires: expires
        },
      });
    } else {
      // если юзер есть, но гость — обновим токен
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: token,
          passwordResetExpires: expires
        }
      });
    }

    // 2) Создаём заказ
    const order = await prisma.orderData.create({
      data: {
        user: { connect: { id: user.id } },
        orderItems,
        address: orderData.address || '',
        phone: orderData.phone || '',
        email: orderData.email || '',
        message: orderData.comment || '',
        shipping: orderData.shipping || null,
        total: Number(orderData.total || 0),
        discount: Number(orderData.discount || 0),
        status: 'NEW',
      },
    });

    // 3) Апсертим userData (контакты)
    const existsUserData = await prisma.userData.findUnique({ where: { userId: user.id } });
    const addr = orderData.address || '';
    if (existsUserData) {
      await prisma.userData.update({
        where: { userId: user.id },
        data: {
          name: orderData.name,
          surname: orderData.surname,
          address: addr,
          phone: orderData.phone,
          orderId: order.id,
        },
      });
    } else {
      await prisma.userData.create({
        data: {
          user: { connect: { id: user.id } },
          name: orderData.name,
          surname: orderData.surname,
          address: addr,
          phone: orderData.phone,
          orderId: order.id,
        },
      });
    }

    return NextResponse.json(
      {
        ok: true,
        orderId: order.id,
        userId: user.id,
        passwordResetToken: token, // <- отдадим на фронт, без почты
        passwordResetExpires: expires
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при сохранении заказа:', error);
    return new NextResponse('Ошибка при сохранении заказа', { status: 500 });
  }
}

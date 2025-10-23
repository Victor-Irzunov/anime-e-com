// /app/api/checkout/guest/route.js — СОЗДАТЬ НОВЫЙ ФАЙЛ
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

function randHex(len=32){ const a="abcdef0123456789"; let s=""; for(let i=0;i<len;i++) s+=a[(Math.random()*a.length)|0]; return s; }
const ONE_DAY_MS = 24*60*60*1000;

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      email, surname, name, patronymic, phone, address, addressFields, comment,
      shipping, orderItems
    } = body || {};

    if (!email || !Array.isArray(orderItems) || orderItems.length===0) {
      return new NextResponse("Некорректные данные заказа", { status: 400 });
    }

    // найти/создать пользователя по email
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // гость без пароля; можно задать временный случайный
      const tmpPass = randHex(16);
      const hashed = await bcrypt.hash(tmpPass, 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashed,   // формально есть (для совместимости), но мы не выдаем его пользователю
          isAdmin: false,
          isGuest: true,
        },
      });
    }

    // создать заказ
    const createdOrder = await prisma.orderData.create({
      data: {
        userId: user.id,
        orderItems: orderItems, // Json
        address: address || "",
        phone: phone || "",
        message: comment || "",
        // можно добавить shippingDetails в схему — пока сохраняем в message при необходимости
      },
    });

    // обновить/создать UserData
    const existingUD = await prisma.userData.findUnique({ where: { userId: user.id } });
    if (existingUD) {
      await prisma.userData.update({
        where: { userId: user.id },
        data: {
          name, surname,
          address: address || "",
          phone: phone || "",
          orderId: createdOrder.id,
        },
      });
    } else {
      await prisma.userData.create({
        data: {
          userId: user.id,
          name, surname,
          address: address || "",
          phone: phone || "",
          orderId: createdOrder.id,
        },
      });
    }

    // сгенерить jwt, чтобы профиль/заказы работали сразу
    const token = jwt.sign(
      { email: user.email, id: user.id, isAdmin: !!user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    // сгенерить reset-токен для установки пароля на «Спасибо»
    const resetToken = randHex(32);
    const expAt = new Date(Date.now() + ONE_DAY_MS);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: resetToken, passwordResetTokenExp: expAt },
    });

    return NextResponse.json({
      ok: true,
      orderId: createdOrder.id,
      token,
      passwordResetToken: resetToken,
    });
  } catch (e) {
    console.error("POST /api/checkout/guest error:", e);
    return new NextResponse("Ошибка оформления заказа", { status: 500 });
  }
}

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req, res) {
  //пароль 123
	try {
		const body = await req.json()
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse('Проверьте email или пароль, или такого пользователя не существует', { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new NextResponse('Неправильный email или пароль', { status: 401 });
    }

    // if (!user.isAdmin) {
    //   return new NextResponse('Вы не администратор! Вход разрешен только администраторам!', { status: 403 });
    // }

    const token = jwt.sign(
      { email: user.email, id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: '30 days' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Ошибка входа:', error);
    return new NextResponse('Ошибка входа!', { status: 500 });
  }
}

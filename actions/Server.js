"use server"
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function createUser(formData) {

  try {
    const { email, password } = Object.fromEntries(formData)
    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userExists?.email) {
      const plainUserExists = JSON.parse(JSON.stringify(userExists));
      return {
        body: JSON.stringify({ message: 'Пользователь уже зарегистрирован в системе' }),
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    // if (isAdmin) {
    // 	const adminExists = await prisma.user.findFirst({
    // 		where: { isAdmin: true },
    // 	});

    // 	if (adminExists) {
    // 		return new NextResponse('Администратор уже существует', { status: 401 });
    // 	}
    // }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const userDB = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    });

    const token = jwt.sign(
      { email: userDB.email, id: userDB.id, isAdmin: userDB.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: '30 days' }
    );

    const plainToken = JSON.parse(JSON.stringify({ token }));

    return {
      body: JSON.stringify(plainToken),
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return new NextResponse('Ошибка регистрации!', { status: 500 });
  }

}
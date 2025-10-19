import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, res) {
	try {
		const {searchParams} = new URL(req.url)
		const id = searchParams.get("id");

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return new NextResponse('Пользователь не найден', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse('Сервернаяя ошибка', { status: 500 });
  }
}

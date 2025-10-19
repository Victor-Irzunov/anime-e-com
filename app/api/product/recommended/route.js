import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
	try {
		const products = await prisma.product.findMany({
			where: {
			  recommended: true,
			},
		 });

	  if (!products || products.length === 0) {
		 return new NextResponse("Продукты не найдены", { status: 404 });
	  }
	  return new NextResponse(JSON.stringify(products), { status: 200 });
	} catch (error) {
	  console.error('Ошибка при получении продукта:', error);
	  return new NextResponse("Ошибка при получении товара", { status: 500 });
	}
 }
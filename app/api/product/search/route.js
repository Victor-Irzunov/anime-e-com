import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
		 const { searchParams } = new URL(req.url);
		 const productSearch = searchParams.get('searchTerm')

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: productSearch,
                        }
                    },
                    {
                        description: {
                            contains: productSearch,
                        }
                    }
                ]
            },
        });

        if (!products || products.length === 0) {
            return new NextResponse("Продукты не найдены", { status: 404 });
        }
        
        return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error('Ошибка при поиске продуктов:', error);
        return new NextResponse("Ошибка при поиске продуктов", { status: 500 });
    }
}

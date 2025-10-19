// import { RECOMMENDED_PRODUCTS } from "@/lib/const/products";
import ProductCardCompact from "../ProductCardCompact";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// async function getData() {
//   try {
//     const data = await prisma.product.findMany({
//       where: {
//         discounts: true,
//       },
//     });
//     if (!data || data.length === 0) {
//       return null;
//     }
//     return data;
//   } catch (error) {
//     console.error("Ошибки при запросе рекомендованых:", error);
//     throw error;
//   }
// }

export default async function RecommendedProducts() {
  const prisma = new PrismaClient();
  let data;
  try {
    data = await prisma.product.findMany({
      where: {
        discounts: true,
      },
    });
    if (!data || data.length === 0) {
      return null;
    }
    return (
      <div className="my-6">
      <h3 className="mb-4 text-xl font-medium">Рекомендуем</h3>
      <div className="grid grid-cols-1 xz:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map((product, idx) => (
          <ProductCardCompact key={product.id} product={product} />
        ))}
      </div>
    </div>
    );
  } catch (error) {
    console.error("Ошибки при запросе рекомендованых:", error);
    // throw error;
  } finally {
    await prisma.$disconnect();
  }
}


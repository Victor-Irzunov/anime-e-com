
// import { QUICK_OFFERS } from "@/lib/const/products";
import CountdownTimer from "../CountdownTimer";
import ProductCardWithDiscount from "../ProductCardWithDiscount";
import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

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
//     console.error("Ошибки при запросе статей:", error);
//     throw error;
//   }
// }


export default async function QuickDeals() {
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
      <div className="my-6 border border-gray-300 bg-white rounded-lg overflow-hidden flex sd:flex-row xz:flex-col">
        <div
          className="p-3 min-h-[14rem] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/offer-bg.png')" }}
        >
          <h3 className="text-xl font-medium">Скидки и предложения</h3>
          <p className="leading-tight text-gray-400 font-normal">Действие акции ограничено</p>
          <div className="pt-6">
            <CountdownTimer />
          </div>
        </div>
        <div className="flex-1 flex sd:flex-row xz:flex-col items-center sd:divide-x  xz:divide-y divide-gray-300">
          {data.slice(0, 5).map((product) => (
            <ProductCardWithDiscount key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Ошибки при запросе статей:", error);
    // throw error;
  } finally {
    await prisma.$disconnect();
  }
}



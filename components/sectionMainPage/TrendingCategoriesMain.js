import ProductCategoryCard from "../ProductCategoryCard";
import { PrismaClient } from '@prisma/client';


export default async function TrendingCategoriesMain() {
  const prisma = new PrismaClient();
  let data;
  try {
    data = await prisma.product.findMany({
      where: {
        banner: true,
      },
    });
    if (!data || data.length === 0) {
      return null;
    }
    return (
      <div className="my-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          {data.slice(0, 2).map((data) => (
            <ProductCategoryCard key={data.id} data={data} size="xl" />
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

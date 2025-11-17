// /app/[category]/[subcategory]/page.jsx — ПОЛНОСТЬЮ
import ClientList from "./ClientList";
import prisma from "@/lib/prisma";

/** Серверная выборка товаров для подкатегории по slug'ам категории и подкатегории */
async function getProductsForSubcategory(category, subcategory) {
  if (!category || !subcategory) return [];

  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          OR: [
            // По связи SubCategory → value
            {
              subCategoryRel: {
                value: subcategory,
              },
            },
            // Фолбэк по строковому полю subcategory в Product
            { subcategory },
          ],
        },
        {
          OR: [
            // По связи Category → value
            {
              categoryRel: {
                value: category,
              },
            },
            // Фолбэк по строковому полю category в Product
            { category },
          ],
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
}

export default async function Page(props) {
  const { category, subcategory } = await props.params;

  const initialProducts = await getProductsForSubcategory(category, subcategory);

  return (
    <ClientList
      category={category}
      subcategory={subcategory}
      initialProducts={initialProducts}
    />
  );
}

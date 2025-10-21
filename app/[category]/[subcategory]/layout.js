// /app/[category]/[subcategory]/layout.js
import prisma from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { category, subcategory } = await params;

  const sub = await prisma.subCategory.findFirst({
    where: { value: subcategory, category: { value: category } },
    include: { category: true },
  });

  if (!sub) {
    return {
      title: "",
      description: "",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${category}/${subcategory}`,
      },
      keywords: "",
    };
  }

  const base = sub.h1 || sub.name;
  const title = `Купить ${base} в Минске`;
  const description = `${base} купить в Минске. Купить можно на сайте с доставкой и самовывозом. Адреса магазинов и телефоны указаны на сайте.`;
  const keywords = `${sub.name.toLowerCase()}, купить, минск, беларусь`;
  const alternates = {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${sub.category.value}/${sub.value}`,
  };

  return {
    title,
    description,
    alternates,
    keywords,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${sub.category.value}/${sub.value}`,
      type: "website",
    },
  };
}

export default function Layout({ children }) {
  return <>{children}</>;
}

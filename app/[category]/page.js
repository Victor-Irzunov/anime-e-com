// /app/[category]/page.jsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClientList from "./ClientList";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = await prisma.category.findFirst({ where: { value: category } });
  if (!cat) {
    return {
      title: "",
      description: "",
      alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${category}` },
      keywords: "",
    };
  }
  const base = cat.h1 || cat.name;
  return {
    title: `Купить ${base} в Минске`,
    description: `${base} купить в Минске. Купить можно на сайте с доставкой и самовывозом. Адреса магазинов и телефоны указаны на сайте.`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${cat.value}` },
    keywords: `${cat.name.toLowerCase()}, купить, каталог`,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;

  const cat = await prisma.category.findFirst({
    where: { value: category },
    include: { subcategories: { orderBy: { name: "asc" } } },
  });

  if (!cat) {
    return (
      <main className="container mx-auto py-10">
        <Breadcrumbs />
        <h1 className="text-3xl">Категория не найдена</h1>
      </main>
    );
  }

  return (
    <main className="pt-2 pb-10">
      <div className="container mx-auto">
        <Breadcrumbs />
        <h1 className="text-4xl font-bold mt-8">{cat.h1 || cat.name}</h1>

        <div className="mt-8 grid sd:grid-cols-4 xz:grid-rows-1 gap-4">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/${cat.value}/${sub.value}`}
              className="btn btn-xs"
            >
              <p className="text-xs font-normal">{sub.name}</p>
            </Link>
          ))}
        </div>



        <div className="mt-12">
          <ClientList category={category} title={cat.h1 || cat.name} />
        </div>

        {cat.contentHtml ? (
          <div
            className="prose max-w-none mt-12"
            dangerouslySetInnerHTML={{ __html: cat.contentHtml }}
          />
        ) : null}
      </div>
    </main>
  );
}

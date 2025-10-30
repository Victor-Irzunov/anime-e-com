import Link from "next/link";
import prisma from "@/lib/prisma";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import ClientList from "./ClientList";

/** === SEO / AEO === */
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

/** Утилита: собрать корректный src из значения в базе */
function normalizeSrc(raw) {
  if (!raw) return "/images/banner/banner.webp";
  if (raw.startsWith("http")) return raw;

  // если уже указан uploads или images — просто убедимся, что начинается со слеша
  if (raw.startsWith("/uploads/") || raw.startsWith("uploads/")) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
  if (raw.startsWith("/images/") || raw.startsWith("images/")) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }

  // в базе лежит только имя файла -> используем public/uploads/<file>
  return `/uploads/${raw}`;
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

  const title = cat.h1 || cat.name;
  const imgSrc = normalizeSrc(cat.image); // <= теперь вернёт /uploads/56c1....webp

  return (
    <main className="pt-2 pb-10">
      <div className="container mx-auto">
        <Breadcrumbs />

        {/* === HERO на фото категории === */}
        <section
          className="relative w-full overflow-hidden rounded-2xl sd:h-80 xz:h-[180px] mt-4"
          aria-label={title}
        >
          <Image
            src={imgSrc}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-center font-extrabold tracking-tight sd:text-5xl xz:text-3xl drop-shadow-md px-3">
              {title}
            </h1>
          </div>
        </section>

        {/* Подкатегории */}
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

        {/* Товары категории */}
        <div className="mt-12">
          {/* ClientList уже в проекте */}
          {/* @ts-expect-error Server Component boundary */}
          <ClientList category={category} title={title} />
        </div>

        {/* SEO-текст + декоративные картинки */}
        {cat.contentHtml ? (
          <div className="relative z-10">
            <div
              className="prose max-w-none mt-12"
              dangerouslySetInnerHTML={{ __html: cat.contentHtml }}
            />
            <Image
              src="/images/anime/anime.webp"
              alt="Аниме фигурка"
              width={300}
              height={300}
              className="absolute sd:top-1/2 xz:top-0 sd:right-0 xz:-right-8 -z-10 sd:w-[300px] xz:w-[200px]"
            />
            <Image
              src="/images/anime/anime-2.webp"
              alt="Аниме фигурка"
              width={200}
              height={200}
              className="absolute -bottom-16 -left-4 -z-10"
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}

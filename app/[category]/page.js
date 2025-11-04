// /app/(category)/[category]/page.jsx — ПОЛНОСТЬЮ
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
    openGraph: {
      title: `Купить ${base} в Минске`,
      description: `${base} купить в Минске. Купить можно на сайте с доставкой и самовывозом.`,
      url: `/${cat.value}`,
      type: "website",
      images: [{ url: "/og/og-image.jpg", width: 1200, height: 630 }],
    },
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

/** Флаг: локальные загрузки из /uploads (для unoptimized) */
const isLocalUpload = (src) => typeof src === "string" && src.startsWith("/uploads/");

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
  const imgSrc = normalizeSrc(cat.image); // /uploads/<file> или плейсхолдер

  return (
    <main className="pt-2 pb-10">
      <div className="container mx-auto">
        {/* Хлебные крошки СВЕРХУ */}
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
            // FIX: не прокидываем functions (loader), только булево unoptimized
            unoptimized={isLocalUpload(imgSrc)}
          />
        </section>

        {/* H1 ПОД изображением */}
        <h1 className="text-center font-extrabold tracking-tight sd:text-5xl xz:text-3xl mt-6">
          {title}
        </h1>

        {/* Подкатегории — плитки с изображением и названием */}
        <section aria-labelledby="subcats-title" className="mt-8">
          <h2 id="subcats-title" className="sr-only">Подкатегории</h2>

          <div className="grid sd:grid-cols-4 xz:grid-cols-2 gap-4 sd:gap-6">
            {cat.subcategories.map((sub) => {
              const subImg = normalizeSrc(sub.image || ""); // /uploads/<file> или плейсхолдер
              const subAlt = sub.h1 || sub.name;

              return (
                <Link
                  key={sub.id}
                  href={`/${cat.value}/${sub.value}`}
                  aria-label={`Открыть подкатегорию ${sub.name}`}
                  className="group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-violet-300 transition-colors"
                >
                  {/* изображение */}
                  <div className="relative w-full sd:h-40 xz:h-28">
                    <Image
                      src={subImg || "/images/banner/banner.webp"}
                      alt={subAlt}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={isLocalUpload(subImg)}
                    />
                  </div>

                  {/* подпись */}
                  <div className="p-3 text-center">
                    <span className="block text-sm sd:text-base font-semibold text-gray-900">
                      {sub.name}
                    </span>
                    <span className="mt-1 inline-block text-xs text-violet-700/80 group-hover:text-violet-700">
                      Перейти →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Товары категории */}
        <div className="mt-12">
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

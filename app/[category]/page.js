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
  const imgSrc = normalizeSrc(cat.image);

  return (
    <main className="sd:pt-12 xz:pt-16 pb-10 overflow-hidden">
      <div className="">
        {/* Хлебные крошки: на десктопе над секцией, на мобиле — поверх фона в hero */}
        <div className="sd:block xz:hidden container mx-auto">
          <Breadcrumbs />
        </div>

        <section
          className="relative w-full overflow-hidden sd:h-auto xz:h-[60vh] mt-4 flex items-end sd:items-center xz:border-b sd:border-none border-sky-400"
          aria-label={title}
        >



          {/* Мобильное фоновое изображение (только xz) */}
          <div className="absolute inset-0 xz:block sd:hidden">
            <Image
              src={imgSrc}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 0px"
              unoptimized={isLocalUpload(imgSrc)}
            />
            {/* затемняющий градиент для читаемости текста */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/5 to-transparent" />
          </div>

          {/* Контент поверх фона */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 sd:px-10 pb-5 sd:pb-0">
            <p className="uppercase tracking-[0.18em] xz:text-[10px] xz:bg-white sd:bg-transparent rounded-md px-2 py-1.5 sd:text-xs text-gray-600 mb-1 sd:mb-3">
              Магазин аниме фигурок Akani в Минске
            </p>

            {/* ВАЖНО: на мобильной версии h1 в "капсуле" для читабельности на картинке */}
            <div className="xz:inline-block xz:px-3 xz:py-2 xz:mt-2 sd:mt-0 xz:rounded-2xl xz:bg-black/60 xz:backdrop-blur-[2px] xz:border xz:border-white/15 sd:bg-transparent sd:border-none sd:px-0 sd:py-0">
              <h1
                className="tracking-tight xz:text-4xl xz:leading-tight sd:text-5xl sd:leading-tight font-bold max-w-3xl"
                style={{
                  background: "linear-gradient(90deg,#27E9E2,#1C7EEC)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {title}
              </h1>
            </div>
          </div>


        </section>

        <div className="sd:hidden xz:block container mx-auto mt-4">
          <Breadcrumbs />
        </div>

        <div className='container mx-auto'>

          {/* Подкатегории — плитки с изображением и названием */}
          <section aria-labelledby="subcats-title" className="mt-8">
            <h2 id="subcats-title" className="sr-only">
              Подкатегории
            </h2>

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
      </div>
    </main>
  );
}

import MapCard from "@/components/common/MapCard";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import HeroCarousel from "@/components/home/HeroCarousel.client";
import NewArrivals from "@/components/home/NewArrivals";
import PopularProducts from "@/components/home/PopularProducts";
import VoprosOtvet from "@/components/home/VoprosOtvet";
import Image from "next/image";
import Script from "next/script";
import BtnComp from "@/components/btn/BtnComp"; // добавил

// === SEO / AEO ===
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://akani.by"),
  title: "Аниме фигурки в Минске — магазин «Акани» | Новинки, предзаказы, мерч",
  description:
    "«Акани» — аниме-магазин в Минске: фигурки, мягкие игрушки, мерч по топ-тайтлам. Самовывоз из ТЦ, курьер по Минску, почта по РБ. Предзаказы, акции и новинки.",
  keywords:
    "аниме магазин Минск, аниме фигурки Минск, фигурки аниме, мерч аниме, мягкие игрушки аниме, предзаказ фигурок Минск",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Аниме фигурки в Минске — «Акани»",
    description:
      "Фигурки, мерч и мягкие игрушки по любимым тайтлам. Самовывоз и доставка.",
    url: "/",
    siteName: "Акани",
    images: [{ url: "/og/og-akani.jpg", width: 1200, height: 630, alt: "Аниме магазин Акани" }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Аниме фигурки в Минске — «Акани»",
    description: "Новинки, предзаказы и мерч. Самовывоз и доставка по РБ.",
    images: ["/og/og-akani.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function Home() {
  return (
    <main className="relative overflow-hidden pt-16">
      {/* Фоновая «неон-аура» */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 10%, rgba(39,233,226,0.25), transparent 60%), radial-gradient(50% 40% at 80% 0%, rgba(28,126,236,0.20), transparent 65%), radial-gradient(60% 60% at 50% 80%, rgba(39,233,226,0.15), transparent 70%)",
        }}
      />

      <section className="container mx-auto sd:px-0 xz:px-3 sd:pt-10 xz:pt-5">
        <div
          className="grid lg:grid-cols-2 gap-8 items-center rounded-3xl p-5 md:p-10 relative border"
          style={{ borderColor: "#1C7EEC22", boxShadow: "0 0 40px #1C7EEC22, inset 0 0 30px #27E9E233" }}
        >
          <div>
            <div className='flex sd:justify-start xz:justify-center'>
              <span className="inline-block text-[10px] sd:text-xs tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
                style={{ background: "#1C7EEC10", color: "#1C7EEC" }}>
                Аниме-магазины в Минске
              </span>
            </div>

            <h1 className="font-extrabold leading-[1.1] text-[clamp(28px,7vw,56px)] xz:text-center sd:text-left">
              <span className="block"
                style={{ background: "linear-gradient(90deg,#27E9E2,#1C7EEC)", WebkitBackgroundClip: "text", color: "transparent" }}>
                Аниме магазин в Минске
              </span>
            </h1>

            <p className="mt-4 sd:text-lg xz:text-sm text-gray-700  max-w-prose">
              💙 У нас вы найдете разные фандомы!
            </p>
            <p className="mt-2 sd:text-lg xz:text-sm text-gray-700  max-w-prose">
              💙 Большой выбор мерча.
            </p>
            <p className="mt-2 sd:text-lg xz:text-sm text-gray-700  max-w-prose">
              💙 Самовывоз из ТЦ
            </p>
            <p className="mt-2 sd:text-lg xz:text-sm text-gray-700  max-w-prose">
              💙 Курьер по Минску
            </p>
            <p className="mt-2 sd:text-lg xz:text-sm text-gray-700  max-w-prose">
              💙 Почта по РБ
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#new"
                className="px-6 py-3 xz:w-full sd:w-auto rounded-xl text-center font-semibold shadow hover:scale-[1.02] transition active:scale-95"
                style={{ background: "linear-gradient(90deg,#27E9E2,#1C7EEC)", color: "#001B2F" }}
              >
                Смотреть новинки
              </a>
              <a
                href="#addresses"
                className="px-6 py-3 xz:w-full sd:w-auto rounded-xl text-center font-semibold border"
                style={{ borderColor: "#1C7ECAA", color: "#1C7EEC" }}
              >
                Адреса магазинов
              </a>
            </div>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {[
                "Хорошие цены",
                "Изготовление магнитов и мерча",
                "Самовывоз и быстрая доставка",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full" style={{ background: i % 2 ? "#1C7EEC" : "#27E9E2" }} />
                  <span className="opacity-90">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Правая колонка */}
          <div className="relative">
            <div className="sd:block xz:hidden">
              <HeroCarousel />
            </div>
            <div className="sd:hidden xz:block">
              <Image
                src="/images/banner/banner.webp"
                alt="Аниме витрина — фигурки и мерч"
                width={900}
                height={700}
                sizes="(max-width: 640px) 100vw, 640px"
                className="rounded-xl"
                priority
              />
            </div>
            <div aria-hidden className="absolute -z-10 inset-0 blur-3xl opacity-60"
              style={{ background: "radial-gradient(50% 50% at 70% 30%, #1C7EEC55, transparent 70%)" }} />
          </div>
        </div>
      </section>

      {/* ==== КАТЕГОРИИ ==== */}
      <section className="container mx-auto sd:py-14 xz:py-8 sd:px-0 xz:px-3">
        <SectionTitle title="Категории" subtitle="Фигурки, мягкие игрушки, мерч по любимым тайтлам" />
        <CategoriesGrid />
      </section>

     

      {/* ==== НОВАЯ СЕКЦИЯ: TELEGRAM ==== */}
      <section className="container mx-auto sd:py-14 xz:py-8 sd:px-0 xz:px-3">
        <div className="rounded-3xl p-5 md:p-10 relative overflow-hidden border"
          style={{ borderColor: "#1C7EEC33", boxShadow: "0 10px 40px #1C7EEC22" }}>
          {/* фоновые свечения */}
          <div aria-hidden className="absolute -z-10 -left-28 -top-24 w-[360px] h-[360px] blur-3xl opacity-50 rounded-full"
            style={{ background: "#27E9E2" }} />
          <div aria-hidden className="absolute -z-10 -right-28 -bottom-24 w-[360px] h-[360px] blur-3xl opacity-50 rounded-full"
            style={{ background: "#1C7EEC" }} />

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <SectionTitle
                title="Наш Telegram-канал"
                subtitle="Анонсы поставок, редкие предзаказы и скидки — всё появляется здесь раньше всего"
                accent="cyan"
              />
              <p className="text-gray-700 sd:text-base xz:text-sm max-w-prose">
                Все новинки в режиме реального времени мы выкладываем в наш Telegram-канал! Также
                можем изготовить на заказ магниты и другой мерч по вашим пожеланиям.
              </p>
              <p className="text-gray-700 sd:text-base xz:text-sm max-w-prose">
                Подписывайтесь, чтобы первыми видеть новинки, участвовать в розыгрышах и ловить промокоды. Мы публикуем живые фото, обзоры и новости магазина.
              </p>

              <div className="mt-6">
                <a
                  href="https://t.me/akanianime"
                  target="_blank"
                  rel="noopener"
                  className="px-6 py-3 rounded-xl font-semibold border inline-flex items-center gap-2"
                  style={{ borderColor: "#1CB0E9", color: "#1CB0E9" }}
                >

                  Telegram-канал
                  <Image src='/images/svg/telegram.svg' alt='telegram' width={30} height={30} />
                </a>
              </div>
            </div>

            {/* SVG-изображение в фирменных цветах, без внешних файлов */}
            <div className="relative">
              <div className="aspect-4/3 w-full rounded-2xl border overflow-hidden"
                style={{ borderColor: "#27E9E244" }}>
                <svg
                  viewBox="0 0 800 600"
                  className="w-full h-full"
                  role="img"
                  aria-label="Иллюстрация Telegram в фирменных цветах"
                >
                  {/* фоновые градиенты */}
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#27E9E2" />
                      <stop offset="100%" stopColor="#1C7EEC" />
                    </linearGradient>
                    <radialGradient id="g2" cx="70%" cy="30%" r="60%">
                      <stop offset="0%" stopColor="#1C7EEC" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#1C7EEC" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect x="0" y="0" width="800" height="600" fill="url(#g2)" />
                  {/* абстрактные круги */}
                  <circle cx="120" cy="120" r="80" fill="#27E9E220" />
                  <circle cx="700" cy="520" r="100" fill="#1C7EEC22" />
                  {/* бумажный самолет в градиенте */}
                  <g transform="translate(180,140) scale(1.2)">
                    <path d="M480 10 L130 160 L250 210 L300 370 L480 10 Z" fill="none" stroke="url(#g1)" strokeWidth="16" strokeLinejoin="round" />
                    <path d="M480 10 L250 210" stroke="#27E9E2" strokeWidth="16" strokeLinecap="round" />
                  </g>
                  {/* волны снизу */}
                  <path d="M0,520 C200,480 300,560 520,520 C640,496 740,560 800,540 L800,600 L0,600 Z" fill="#27E9E211" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==== НОВИНКИ ==== */}
      <section id="new" className="container mx-auto sd:py-14 xz:py-8">
        <SectionTitle title="Новинки" subtitle="Самые свежие поступления — не пропустите!" accent="cyan" />
        <NewArrivals />
      </section>

      {/* ==== ПОПУЛЯРНОЕ ==== */}
      <section className="container mx-auto sd:py-10 xz:py-6">
        <SectionTitle title="Популярные товары" subtitle="То, что чаще всего выбирают наши покупатели" accent="blue" />
        <PopularProducts />
      </section>

      {/* ==== ОПИСАНИЕ (AEO) ==== */}
      <section className="container mx-auto sd:py-16 xz:py-10 sd:px-0 xz:px-3 relative">
        <SectionTitle title="«Акани» — аниме магазин в Минске" subtitle="Фигурки, мерч и подарки для фанатов" />
        <div className="prose max-w-none sd:text-base xz:text-sm leading-relaxed">
          <p>
            У нас широкий ассортимент <strong>аниме фигурок</strong> (статичные и экшен),
            <em>мягких игрушек</em> и трендового мерча по популярным тайтлам и играм.
            Заказывайте онлайн с доставкой или забирайте в наших точках самовывоза.
          </p>
          <ul>
            <li>Самовывоз из наших магазинов в Минске.</li>
            <li>Курьер по городу и почта по Беларуси.</li>
            <li>Оперативная связь по предзаказам и наличию.</li>
          </ul>
          <p>Подписывайтесь на Telegram — там первыми публикуем новинки и анонсы поставок.</p>
        </div>

        {/* декоративную картинку выключаем на xz, чтобы не было «битого» значка */}
        <Image
          src="/images/anime/anime.webp"
          alt="Аниме фигурка"
          width={320}
          height={320}
          sizes="320px"
          className="absolute sd:block xz:hidden sd:top-6 sd:-right-6 opacity-70 pointer-events-none"
          loading="lazy"
        />
      </section>

      {/* ==== АДРЕСА ==== */}
      <section id="addresses" className="container mx-auto sd:py-14 xz:py-8 sd:px-0 xz:px-3">
        <SectionTitle title="Адреса магазинов" subtitle="Самовывоз и консультации в точках" />
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <MapCard
            title="Аниме Игрушки Минск — ТЦ «Минск Сити Молл»"
            address="ул. Толстого, 1 — 3 этаж, большой островок"
            embedUrl="https://www.google.com/maps?q=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA,+%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B3%D0%BE+1&output=embed"
            placeholderSrc="/images/maps/minsk-city-mall.webp"
            mode="click"
            height={320}
          />
          <MapCard
            title="Аниме Игрушки Минск — ТЦ «Магнит»"
            address="пр-т Дзержинского, 106 (1 этаж, около бокового входа)"
            embedUrl="https://www.google.com/maps?q=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA,+%D0%94%D0%B7%D0%B5%D1%80%D0%B6%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE+106&output=embed"
            placeholderSrc="/images/maps/magnit.webp"
            mode="click"
            height={320}
          />
        </div>
      </section>

      {/* <VoprosOtvet /> */}

      {/* ==== JSON-LD ==== */}
      <Script id="ld-localbusiness" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Акани — аниме магазин",
            image: ["/og/og-akani.jpg"],
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://akani.by",
            telephone: "+375 (00) 000-00-00",
            address: { "@type": "PostalAddress", addressLocality: "Минск", addressCountry: "BY" },
            sameAs: ["https://t.me/akanianime"],
          }),
        }}
      />
      <Script id="ld-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Где в Минске можно купить аниме фигурки?",
                acceptedAnswer: { "@type": "Answer", text: "В магазинах сети «Акани» и в нашем интернет-магазине. Доступны самовывоз и доставка." },
              },
              {
                "@type": "Question",
                name: "Осуществляете ли вы доставку по Беларуси?",
                acceptedAnswer: { "@type": "Answer", text: "Да. По Минску — курьером, по Беларуси — почтой. Обычно 1–3 рабочих дня." },
              },
            ],
          }),
        }}
      />
    </main>
  );
}

/** Заголовок секции */
function SectionTitle({ title, subtitle, accent }) {
  const accentColor = accent === "blue" ? "#1C7EEC" : accent === "cyan" ? "#27E9E2" : "#27E9E2";
  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 mb-3">
        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: accentColor }} />
        <span className="text-[10px] sd:text-xs uppercase tracking-widest" style={{ color: accentColor }}>
          раздел
        </span>
      </div>
      <h2 className="font-semibold text-[clamp(22px,6vw,48px)]">
        <span style={{ background: "linear-gradient(90deg,#27E9E2,#1C7EEC)", WebkitBackgroundClip: "text", color: "transparent" }}>
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="mt-2 text-gray-600 sd:text-base xz:text-sm max-w-prose">
          {subtitle}
        </p>
      )}
    </div>
  );
}

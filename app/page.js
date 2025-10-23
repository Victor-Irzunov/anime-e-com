import MapCard from "@/components/common/MapCard";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import HeroCarousel from "@/components/home/HeroCarousel.client";
import NewArrivals from "@/components/home/NewArrivals";
import PopularProducts from "@/components/home/PopularProducts";
import VoprosOtvet from "@/components/home/VoprosOtvet";
import Image from "next/image";

// /app/page.jsx
export default function Home() {
  return (
    <main className="">

      {/* Хиро-слайдер */}
      <section className="sd:block xz:hidden container mx-auto sd:pt-6 xz:pt-3 sd:px-0 xz:px-3">
        <HeroCarousel />
      </section>

      <section className="container mx-auto">
        <div className="sd:my-16 xz:my-7">
          <h1 className="sd:text-5xl xz:text-4xl font-semibold heading-gradient text-center">
            Интернет-магазин Аниме в Минске
          </h1>
        </div>
      </section>
      <CategoriesGrid />

      {/* Секция: описание магазина */}
      <section className="container mx-auto sd:py-16 xz:py-10 sd:px-0 xz:px-3 relative z-10">
        <h2 className="sd:text-3xl xz:text-xl font-normal mb-6">
          Аниме магазин «Акани» — Минск
        </h2>
        <div className="prose max-w-none sd:text-base xz:text-sm leading-relaxed">
          <p>
            «Акани» — сеть аниме-магазинов в г. Минске. У нас представлен широкий
            ассортимент <strong>аниме фигурок</strong> (как статичных, так и экшен),
            аксессуаров и сопутствующего мерча по популярным тайтлам и отдельным
            играм. Мы регулярно пополняем ассортимент <em>мягких игрушек</em> и
            трендовых товаров — актуальные поступления появляются на сайте и в
            наших офлайн-точках.
          </p>
          <p>
            Часть ассортимента показана на сайте: вы можете заказать онлайн с
            доставкой или оформить самовывоз. Мы стараемся держать конкурентные
            цены, внимательно упаковываем каждый заказ и оперативно связываемся
            по вопросам предзаказов и наличия.
          </p>
          <ul>
            <li>Самовывоз из наших магазинов в Минске.</li>
            <li>Доставка по городу курьером.</li>
            <li>Доставка по Беларуси почтой.</li>
          </ul>
          <p>
            Подписывайтесь на наш Telegram-канал — там мы в реальном времени
            показываем обновления ассортимента и анонсы поставок.
          </p>
        </div>

        <Image
          src='/images/anime/anime.webp'
          alt='Аниме фигурка'
          width={300} height={300}
          className="absolute sd:top-1/2 xz:top-0 sd:right-0 xz:-right-8 -z-10 sd:w-[300px] xz:w-[200px]"
        />

      </section>

      {/* Секция: адреса и карты */}
      <section className="container mx-auto sd:py-10 xz:py-8 sd:px-0 xz:px-3">
        <h2 className="sd:text-4xl xz:text-2xl font-normal mb-6">Адреса магазинов</h2>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <MapCard
            title="Аниме Игрушки Минск — ТЦ «Минск Сити Молл»"
            address="ул. Толстого, 1 — 3 этаж, большой островок"
            // Тот же embed, что был:
            embedUrl="https://www.google.com/maps?q=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA,+%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B3%D0%BE+1&output=embed"
            placeholderSrc="/images/maps/minsk-city-mall.webp" // сделай скрин и положи сюда
            mode="click" // или "visible", если хочешь грузить при прокрутке
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

      <NewArrivals />
      <PopularProducts />

      <VoprosOtvet />
    </main>
  );
}

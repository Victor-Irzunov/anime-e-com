import CategoriesGrid from "@/components/home/CategoriesGrid";
import NewArrivals from "@/components/home/NewArrivals";
import PopularProducts from "@/components/home/PopularProducts";
import VoprosOtvet from "@/components/home/VoprosOtvet";

// /app/page.jsx
export default function Home() {
  return (
    <main className="">
      <div className="container mx-auto">
        <div className="my-10">
          <h1 className="sd:text-4xl xz:text-2xl font-semibold">
            Интернет-магазин Аниме в Минске
          </h1>
        </div>
      </div>



      <CategoriesGrid />

      {/* Секция: описание магазина */}
      <section className="container mx-auto sd:py-16 xz:py-10 sd:px-0 xz:px-3">
        <h2 className="sd:text-5xl xz:text-3xl font-normal mb-6">
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
      </section>

      {/* Секция: адреса и карты */}
      <section className="container mx-auto sd:py-10 xz:py-8 sd:px-0 xz:px-3">
        <h2 className="sd:text-4xl xz:text-2xl font-normal mb-6">Адреса магазинов</h2>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <div className="p-4">
              <h3 className="font-semibold">Аниме Игрушки Минск — ТЦ «Минск Сити Молл»</h3>
              <p className="text-sm text-gray-600">
                ул. Толстого, 1 — 3 этаж, большой островок
              </p>
            </div>
            <iframe
              title="Толстого, 1"
              className="w-full h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA,+%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B3%D0%BE+1&output=embed"
            />
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <div className="p-4">
              <h3 className="font-semibold">Аниме Игрушки Минск — ТЦ «Магнит»</h3>
              <p className="text-sm text-gray-600">пр-т Дзержинского, 106</p>
              <p className="text-xs text-gray-500">
                1 этаж, магазин около бокового входа
              </p>
            </div>
            <iframe
              title="Дзержинского, 106"
              className="w-full h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA,+%D0%94%D0%B7%D0%B5%D1%80%D0%B6%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE+106&output=embed"
            />
          </div>
        </div>
      </section>

      <NewArrivals />
      <PopularProducts />

      <VoprosOtvet />
    </main>
  );
}

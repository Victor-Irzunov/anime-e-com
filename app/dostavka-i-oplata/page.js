import { siteName, siteDomain, siteCity } from "@/config/config";

export const metadata = {
  title: `Доставка и оплата — ${siteName}`,
  description: `Условия доставки Европочтой, Белпочтой и самовывоз из магазинов в ${siteCity}. Оплата наложенным платежом, банкинг/ЕРИП.`,
  alternates: { canonical: "/dostavka-i-oplata" },
  openGraph: {
    title: `Доставка и оплата — ${siteName}`,
    description: `Европочта, Белпочта, самовывоз. Бесплатная доставка от 100 BYN. Способы оплаты: наложенный платёж, банкинг/ЕРИП.`,
    url: "/dostavka-i-oplata",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="container mx-auto sd:py-12 xz:py-8 sd:px-0 xz:px-3">
      <h1 className="sd:text-4xl xz:text-3xl font-medium mb-6">Доставка и оплата</h1>

      {/* Европочта */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Доставка Европочтой</h2>
        <p className="mb-3">
          Доставка осуществляется в течение нескольких дней после оформления заказа на нашем сайте.
          Точный срок уточним после оформления, так как в отдельные города/пункты сроки могут отличаться.
          Стоимость доставки не включена в цену товара на сайте и оплачивается при получении. Приблизительную
          стоимость вы увидите при оформлении, точную назовёт менеджер после проверки заказа.
        </p>
        <p className="mb-3">
          Сбор заказов для отправки — каждый день до 12:00. Заказы, оформленные после 12:00, отправляются на следующий день.
        </p>
        <p className="mb-3 font-medium">
          ВНИМАНИЕ: при заказе от 100 BYN доставка Европочтой — <span className="text-green-600">бесплатно</span>.
        </p>
        <h3 className="font-semibold mt-4 mb-2">Оплата</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Наложенным платежом при получении в отделении «Европочта».</li>
          <li>Предоплата — банкинг.</li>
        </ul>
        <p className="text-sm text-gray-600 mt-3">
          *При оплате наложенным платежом дополнительно взимается комиссия «Европочта» 2–3% от суммы перевода.
        </p>
      </section>

      {/* Белпочта */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Доставка Белпочтой</h2>
        <p className="mb-3">
          Доставка осуществляется в течение нескольких дней после оформления заказа. Сроки зависят от региона.
          Стоимость доставки оплачивается при получении и не входит в стоимость на сайте.
        </p>
        <p className="mb-3">Сбор заказов для отправки — ежедневно до 12:00. Оформленные позже — на следующий день.</p>
        <p className="mb-3 font-medium">
          ВНИМАНИЕ: при заказе от 100 BYN доставка Белпочтой — <span className="text-green-600">бесплатно</span>.
        </p>
        <h3 className="font-semibold mt-4 mb-2">Оплата</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Наложенным платежом при получении в отделении РУП «Белпочта».</li>
          <li>Предоплата — ЕРИП.</li>
        </ul>
        <p className="text-sm text-gray-600 mt-3">
          *При наложенном платеже «Белпочта» удерживает 2–3% за перевод денежных средств.
        </p>
      </section>

      {/* Самовывоз */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Самовывоз</h2>
        <p className="mb-3">
          Вы можете забрать заказ самостоятельно в наших магазинах в {siteCity}. После оформления мы подтвердим
          бронь и сообщим, когда заказ будет готов к выдаче (обычно 30–60 минут).
        </p>
        <p className="mb-4">График работы: Пн–Вс 11:00–20:00.</p>

        <ul className="space-y-3">
          <li className="border rounded-lg p-4">
            <p className="font-semibold">Аниме Игрушки {siteCity} — ТЦ «Minsk City Mall»</p>
            <p>Адрес: ул. Толстого, 1 — 3 этаж, большой островок.</p>
          </li>
          <li className="border rounded-lg p-4">
            <p className="font-semibold">Аниме Игрушки {siteCity} — ТЦ «Магнит»</p>
            <p>Адрес: пр-т Дзержинского, 106 — 1 этаж, магазин около бокового входа.</p>
          </li>
        </ul>

        <h3 className="font-semibold mt-5 mb-2">Оплата при самовывозе</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Наличные на месте</li>
          <li>Банковская карта на месте</li>
          <li>Предоплата — ЕРИП</li>
        </ul>
      </section>
    </main>
  );
}

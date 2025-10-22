// /app/kontakty/page.tsx (или .jsx)
import Image from "next/image";
import Link from "next/link";
import phoneNumbers, { siteName, siteDomain, siteCity } from "@/config/config";

export const metadata = {
  title: `Контакты — ${siteName}`,
  description: `Связаться с ${siteName}: телефоны, мессенджеры, адреса магазинов в ${siteCity}.`,
  alternates: { canonical: "/kontakty" },
  openGraph: {
    title: `Контакты — ${siteName}`,
    description: `Телефоны, мессенджеры, адреса и режим работы магазинов ${siteName} в ${siteCity}.`,
    url: "/kontakty",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  const email = `Art2945909@yandex.ru`;
  const wa = `https://wa.me/${phoneNumbers.phone1Social || ""}`;
  const tg = ""; // добавишь username при необходимости
  const vb = phoneNumbers.phone1Social
    ? `viber://chat?number=${encodeURIComponent(phoneNumbers.phone1Social)}`
    : "";

  // ⬇️ ДОПОЛНЕНО: юр. данные в JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteName,
    legalName: "ИП Соколовский Артур Игоревич",
    taxID: "191656638",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/kontakty`,
    telephone: phoneNumbers.phone1Link,
    email,
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Минск",
        streetAddress: "ул. Толстого, 1 (ТЦ Minsk City Mall, 3 этаж, островок)",
        addressCountry: "BY",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Минск",
        streetAddress: "пр-т Дзержинского, 106 (ТЦ Магнит, 1 этаж у бокового входа)",
        addressCountry: "BY",
      },
    ],
    openingHours: ["Mo-Su 11:00-20:00"],
  };

  return (
    <main className="container mx-auto sd:py-12 xz:py-8 sd:px-0 xz:px-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sd:text-4xl xz:text-3xl font-medium mb-6">Контакты</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Связаться с нами</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image src="/images/svg/phone.svg" alt="" width={20} height={20} />
              <a className="text-lg" href={`tel:${phoneNumbers.phone1Link}`}>{phoneNumbers.phone1}</a>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/images/svg/mail.svg" alt="" width={20} height={20} />
              <a className="underline underline-offset-4" href={`mailto:${email}`}>{email}</a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              {tg ? (
                <Link href={tg} className="underline" target="_blank" rel="nofollow noopener">Telegram</Link>
              ) : null}
              {vb ? (
                <Link href={vb} className="underline" target="_blank" rel="nofollow noopener">Viber</Link>
              ) : null}
              {wa ? (
                <Link href={wa} className="underline" target="_blank" rel="nofollow noopener">WhatsApp</Link>
              ) : null}
            </div>

            {/* ⬇️ НОВОЕ: Реквизиты прямо в карточке контактов */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500">Реквизиты</h3>
              <div className="mt-2 text-sm text-gray-700">
                <div>ИП Соколовский Артур Игоревич</div>
                <div>УНП 191656638</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">Режим работы магазинов: Пн–Вс 11:00–20:00</p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Адреса магазинов</h2>
          <ul className="space-y-4">
            <li>
              <p className="font-semibold">ТЦ «Minsk City Mall»</p>
              <p>ул. Толстого, 1 — 3 этаж, большой островок</p>
              <div className="rounded-lg overflow-hidden border mt-2">
                <iframe
                  title="Minsk City Mall"
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3Asearch&ll=27.534%2C53.893&z=14&text=%D0%A3%D0%BB.%20%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B3%D0%BE%201%2C%20%D0%9C%D0%B8%D0%BD%D1%81%D0%BA"
                  width="100%"
                  height="260"
                  frameBorder="0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </li>
            <li>
              <p className="font-semibold">ТЦ «Магнит»</p>
              <p>пр-т Дзержинского, 106 — 1 этаж, магазин у бокового входа</p>
              <div className="rounded-lg overflow-hidden border mt-2">
                <iframe
                  title="ТЦ Магнит"
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3Asearch&ll=27.479%2C53.869&z=14&text=%D0%94%D0%B7%D0%B5%D1%80%D0%B6%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20106%2C%20%D0%9C%D0%B8%D0%BD%D1%81%D0%BA"
                  width="100%"
                  height="260"
                  frameBorder="0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

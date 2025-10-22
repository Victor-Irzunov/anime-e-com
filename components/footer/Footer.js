// /components/layout/Footer.jsx
import Link from "next/link";
import phoneNumbers, { siteName, siteCity } from "@/config/config";
import {
  RiFacebookCircleFill,
  RiInstagramLine,
  RiLinkedinFill,
  RiTwitterFill,
} from "react-icons/ri";
import Image from "next/image";

/** Тянем категории из публичного API */
async function getCategories() {
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/catalog/categories`,
      { next: { revalidate: 3600 } }
    );
    const j = await r.json().catch(() => ({}));
    return Array.isArray(j?.items) ? j.items : Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

/** Кнопки мессенджеров (градиент #27E9E2 → #1C7EEC) */
function Messengers() {
  const wa = phoneNumbers.phone1Social
    ? `https://wa.me/${phoneNumbers.phone1Social}`
    : "";
  const vb = phoneNumbers.phone1Social
    ? `viber://chat?number=%2B${encodeURIComponent(phoneNumbers.phone1Social)}`
    : "";
  const tg = process.env.NEXT_PUBLIC_TG_USERNAME
    ? `https://t.me/${process.env.NEXT_PUBLIC_TG_USERNAME}`
    : "";
  const ig = process.env.NEXT_PUBLIC_IG_URL || "";

  const GradBtn = ({ href, label, children }) =>
    href ? (
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener"
        aria-label={label}
        className="h-11 w-11 rounded-xl grid place-items-center text-white shadow-lg transition hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #27E9E2 0%, #1C7EEC 100%)",
        }}
      >
        {children}
      </a>
    ) : null;

  return (
    <div className="flex items-center gap-3">
      <GradBtn href={vb} label="Viber">
        <svg viewBox="0 0 1024 1024" width="22" height="22" className="fill-current">
          <path d="M512 85.333c-282.88 0-384 95.573-384 362.667 0 183.893 48.213 286.72 170.667 332.8v136.533a21.333 21.333 0 0 0 21.333 21.334h13.227a21.76 21.76 0 0 0 14.08-5.547l136.533-122.453H512c282.88 0 384-95.573 384-362.667S794.88 85.333 512 85.333z m-10.667 279.894a20.48 20.48 0 0 1 8.107-16.64 19.627 19.627 0 0 1 17.92-4.267 116.907 116.907 0 0 1 88.32 88.32 19.627 19.627 0 0 1-4.267 17.92 20.48 20.48 0 0 1-16.64 8.107h-21.76a21.333 21.333 0 0 1-20.48-15.36 53.76 53.76 0 0 0-35.84-35.84 21.333 21.333 0 0 1-15.36-20.48z m157.013 256a90.027 90.027 0 0 1-42.667 35.413 49.067 49.067 0 0 1-38.827 0 485.547 485.547 0 0 1-246.613-219.307 651.093 651.093 0 0 1-28.587-66.56A91.307 91.307 0 0 1 298.667 355.84a66.133 66.133 0 0 1 56.32-62.72h8.107a33.28 33.28 0 0 1 20.907 8.96 244.907 244.907 0 0 1 52.48 72.533 24.747 24.747 0 0 1-6.4 31.147l-6.4 5.547a36.693 36.693 0 0 0-13.653 54.613A177.067 177.067 0 0 0 506.027 554.667a26.453 26.453 0 0 0 31.147-6.827l2.987-3.84c17.067-28.587 42.667-25.6 64.853-9.387l42.667 32.853c24.32 17.067 24.32 32.427 10.667 55.04z m60.587-170.667a21.333 21.333 0 0 1-16.213 7.253H682.667a21.76 21.76 0 0 1-21.333-18.773A159.573 159.573 0 0 0 520.107 298.667a21.76 21.76 0 0 1-18.773-21.334V256a21.333 21.333 0 0 1 7.253-16.213 20.053 20.053 0 0 1 16.213-5.12 224.427 224.427 0 0 1 200.533 200.533 20.053 20.053 0 0 1-6.4 16.213z" />
        </svg>
      </GradBtn>

      <GradBtn href={tg} label="Telegram">
        <svg viewBox="0 0 1024 1024" width="20" height="20" className="fill-current">
          <path d="M679.424 746.862l84.005-395.996c7.424-34.853-12.581-48.567-35.438-40.009L234.277 501.138c-33.719 13.129-33.134 32-5.705 40.558l126.281 39.424 293.157-184.576c13.714-9.143 26.295-3.986 16.018 5.157L427.2 615.973l-9.143 130.304c13.129 0 18.871-5.705 25.71-12.581l61.696-59.429 128 94.281c23.442 13.129 40.009 6.29 46.299-21.724zM1024 512c0 282.843-229.157 512-512 512S0 794.843 0 512 229.157 0 512 0s512 229.157 512 512z" />
        </svg>
      </GradBtn>

      <GradBtn href={wa} label="WhatsApp">
        <svg viewBox="0 0 1024 1024" width="22" height="22" className="fill-current">
          <path d="M512 85.333a426.667 426.667 0 0 0-345.6 676.693L128 878.933a20.907 20.907 0 0 0 5.12 21.76 21.76 21.76 0 0 0 21.76 5.547l121.6-39.253A426.667 426.667 0 1 0 512 85.333z m248.32 602.453a119.893 119.893 0 0 1-85.333 60.16c-22.187 4.693-51.627 8.533-149.334-32a530.347 530.347 0 0 1-213.333-187.734 242.773 242.773 0 0 1-50.773-128 136.96 136.96 0 0 1 42.667-104.106 63.573 63.573 0 0 1 42.667-15.36h14.08c12.373 0 18.773 0 27.307 20.907s34.987 85.333 37.973 92.16a24.32 24.32 0 0 1 2.133 23.04 78.933 78.933 0 0 1-14.08 19.627c-5.973 7.253-12.373 12.8-18.347 20.48a20.053 20.053 0 0 0-5.12 26.88 381.44 381.44 0 0 0 69.12 85.333 313.173 313.173 0 0 0 100.267 61.867 26.453 26.453 0 0 0 29.867-4.693 426.667 426.667 0 0 0 33.28-42.667 23.893 23.893 0 0 1 30.72-8.96c11.52 3.84 72.533 34.133 85.333 40.107s20.907 9.387 23.894 14.507a106.667 106.667 0 0 1-2.987 58.453z" />
        </svg>
      </GradBtn>

      <GradBtn href={ig} label="Instagram">
        <RiInstagramLine size={20} />
      </GradBtn>
    </div>
  );
}

export default async function Footer() {
  const categories = await getCategories();
  const email = `Art2945909@yandex.ru`;

  return (
    <footer
      className="relative z-10 text-white overflow-hidden mt-16"
      style={{ background: "linear-gradient(135deg, #27E9E2 0%, #1C7EEC 100%)" }}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ background: "#ffffff" }}
      />
      <div className="container mx-auto px-4 sd:py-14 xz:py-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-10">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white text-xl font-semibold"
              aria-label={`${siteName} — на главную`}
            >
              <Image
                src="/logo/logo.webp"
                alt="Логотип - магазины аниме в Минске"
                width={100}
                height={80}
                className="drop-shadow-[0_4px_14px_rgba(0,0,0,.25)]"
              />
            </Link>

            <p className="sd:text-sm xz:text-xs leading-relaxed text-white/90">
              Аниме магазин «Акани» — сеть магазинов в г. {siteCity}. Фигурки, мерч, мягкие
              игрушки и трендовые товары. Онлайн-заказы с доставкой по всей Беларуси, на точках —
              ещё больше ассортимента. Подписывайтесь на наш телеграм-канал с живыми обновлениями.
            </p>

      
          </div>

          <div>
            <p className="text-lg font-semibold">Каталог</p>
            {categories.length ? (
              <ul className="mt-5 space-y-2 text-[15px]">
                {categories.slice(0, 10).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/${encodeURIComponent(c.value)}`}
                      className="text-white/90 hover:text-white underline-offset-4 hover:underline transition"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-white/80 text-sm">Разделы появятся скоро.</p>
            )}
          </div>

          <div>
            <p className="text-lg font-semibold">Информация</p>
            <ul className="mt-5 space-y-2 text-[15px]">
              <li><Link href="/dostavka-i-oplata" className="text-white/90 hover:text-white hover:underline underline-offset-4">Доставка и оплата</Link></li>
              <li><Link href="/vozvrat-i-garantii" className="text-white/90 hover:text-white hover:underline underline-offset-4">Возврат и гарантии</Link></li>
              <li><Link href="/faq" className="text-white/90 hover:text-white hover:underline underline-offset-4">Вопрос-ответ (FAQ)</Link></li>
              <li><Link href="/o-kompanii" className="text-white/90 hover:text-white hover:underline underline-offset-4">О компании</Link></li>
              <li><Link href="/polzovatelskoe-soglashenie" className="text-white/90 hover:text-white hover:underline underline-offset-4">Пользовательское соглашение</Link></li>
              <li><Link href="/kontakty" className="text-white/90 hover:text-white hover:underline underline-offset-4">Контакты</Link></li>
              <li><Link href="/personal-info" className="text-white/90 hover:text-white hover:underline underline-offset-4">Политика конфиденциальности</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-lg font-semibold">Контакты</p>
            <ul className="mt-5 space-y-2 text-[15px]">
              <li className="flex items-center gap-2">
                <span className="text-white/80">Тел.:</span>
                <a href={`tel:${phoneNumbers.phone1Link}`} className="text-white hover:underline underline-offset-4">
                  {phoneNumbers.phone1}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white/80">Почта:</span>
                <a href={`mailto:Art2945909@yandex.ru`} className="text-white hover:underline underline-offset-4">
                  Art2945909@yandex.ru
                </a>
              </li>
            </ul>

            <p className="mt-5 text-sm text-white/80 font-semibold">Адреса магазинов</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="text-white/90">ул. Толстого, 1 — ТЦ «Minsk City Mall», 3 этаж, большой островок</li>
              <li className="text-white/90">пр-т Дзержинского, 106 — ТЦ «Магнит», 1 этаж, около бокового входа</li>
            </ul>

            <p className="mt-5 text-sm text-white/80 font-semibold">Реквизиты</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="text-white/90">ИП Соколовский Артур Игоревич</li>
              <li className="text-white/90">УНП 191656638</li>
            </ul>

            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://yandex.ru/maps"
                target="_blank"
                rel="nofollow noopener"
                className="text-xs text-white/90 underline"
              >
                Посмотреть на карте
              </a>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Link href="#" aria-label="Facebook" className="opacity-90 hover:opacity-100">
                <RiFacebookCircleFill size={22} />
              </Link>
              <Link href={process.env.NEXT_PUBLIC_IG_URL || "#"} aria-label="Instagram" className="opacity-90 hover:opacity-100">
                <RiInstagramLine size={22} />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="opacity-90 hover:opacity-100">
                <RiLinkedinFill size={22} />
              </Link>
              <Link href="#" aria-label="Twitter" className="opacity-90 hover:opacity-100">
                <RiTwitterFill size={22} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-4 flex flex-col sd:flex-row items-center justify-between gap-3">
          <p className="sd:text-sm xz:text-xs">
            &copy; {new Date().getFullYear()} {siteName}. Все права защищены.
          </p>
          <div className="sd:text-sm xz:text-xs">Сделано с любовью к аниме • {siteCity}</div>
        </div>
      </div>

      <Image
        src="/images/anime/anime-3.webp"
        alt="Аниме фигурка"
        width={320}
        height={320}
        className="absolute sd:top-1/3 xz:bottom-2 sd:right-4 xz:right-2 opacity-60 pointer-events-none select-none"
      />
    </footer>
  );
}

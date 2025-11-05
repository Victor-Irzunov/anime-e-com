// /components/header/TopBarFixedMobile.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import phoneNumbers from "@/config/config";

const abs = (u) =>
  /^https?:\/\//i.test(u || "")
    ? u
    : `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}${
        u?.startsWith("/") ? "" : "/"
      }${u || ""}`;

const SMALL_TOP_H = 30; // верхняя тонкая панель высотой ~34px
const MAIN_TOP_H = 56;  // панель с логотипом и поиском ~56px
const DROPDOWN_TOP = `${SMALL_TOP_H + MAIN_TOP_H}px`;

export default function TopBarFixedMobile() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const wrapRef = useRef(null);
  const timer = useRef(null);

  // клик вне — закрыть дроп
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // дебаунс поиска (300мс)
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (!q || q.trim().length < 1) {
      setItems([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    timer.current = setTimeout(async () => {
      try {
        setLoading(true);
        const r = await fetch(
          `/api/product/search?q=${encodeURIComponent(q.trim())}`,
          { cache: "no-store" }
        );
        const j = await r.json();
        const arr = Array.isArray(j?.items) ? j.items : [];
        setItems(arr);
        setOpen(true);
      } catch {
        setItems([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => timer.current && clearTimeout(timer.current);
  }, [q]);

  // группировка результатов
  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of items) {
      const cKey = it.categoryValue || "other";
      const sKey = it.subcategoryValue || "other";
      if (!map.has(cKey)) {
        map.set(cKey, {
          categoryValue: cKey,
          categoryName: it.categoryName || cKey,
          sub: new Map(),
        });
      }
      const cat = map.get(cKey);
      if (!cat.sub.has(sKey)) {
        cat.sub.set(sKey, {
          subcategoryValue: sKey,
          subcategoryName: it.subcategoryName || sKey,
          products: [],
        });
      }
      cat.sub.get(sKey).products.push(it);
    }
    return Array.from(map.values()).map((cat) => ({
      ...cat,
      sub: Array.from(cat.sub.values()),
    }));
  }, [items]);

  const viberHref = `viber://chat?number=%2B${phoneNumbers.phone1Social || ""}`;
  const tgHref = "https://t.me/akanianime";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 sd:hidden xz:block">
      {/* ===== Верхняя тонкая панель: dropdown + телефон + иконки ===== */}
      <div
        className="w-full border-b"
        style={{
          height: SMALL_TOP_H,
          background:
            "#ffffff",
          borderColor: "#0E2F5A66",
        }}
      >
        <div className="container mx-auto h-full flex items-center justify-between">
          {/* Dropdown (daisyui) */}
          <div className="dropdown dropdown-bottom">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-xs h-6 min-h-0"
            >
              <span className="text-[12px]">Покупателю</span>
              <svg
                className="ml-1 w-3 h-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>

            <div
              tabIndex={0}
              className="dropdown-content mt-1 rounded-xl shadow-2xl bg-[#0E1930] border border-[#1C7EEC44] w-[92vw] max-w-none"
            >
              <div className="p-4">
                <p className="text-white/80 text-sm font-semibold">
                  Помощь и информация
                </p>
                <hr className="my-3 border-white/10" />
                <ul className="space-y-2 text-[15px]">
                  <li>
                    <Link
                      href="/dostavka-i-oplata"
                      className="text-white/90 hover:text-white hover:underline underline-offset-4"
                    >
                      Доставка и оплата
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vozvrat-i-garantii"
                      className="text-white/90 hover:text-white hover:underline underline-offset-4"
                    >
                      Возврат и гарантии
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/o-kompanii"
                      className="text-white/90 hover:text-white hover:underline underline-offset-4"
                    >
                      О компании
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/polzovatelskoe-soglashenie"
                      className="text-white/90 hover:text-white hover:underline underline-offset-4"
                    >
                      Пользовательское соглашение
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kontakty"
                      className="text-white/90 hover:text-white hover:underline underline-offset-4"
                    >
                      Контакты
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/personal-info"
                      className="text-white/90 hover:text-white hover:underline underline-offset-4"
                    >
                      Политика конфиденциальности
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Справа: маленький телефон + иконки */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${phoneNumbers.phone1Link || ""}`}
              className="text-[12px]"
            >
              {phoneNumbers.phone1}
            </a>
            <a href={viberHref} aria-label="Viber" className="opacity-90 hover:opacity-100">
              <Image
                src="/images/svg/viber.svg"
                alt="Viber"
                width={18}
                height={18}
                priority={false}
              />
            </a>
            <a href={tgHref} target="_blank" rel="noopener" aria-label="Telegram" className="opacity-90 hover:opacity-100">
              <Image
                src="/images/svg/telegram.svg"
                alt="Telegram"
                width={20}
                height={20}
                priority={false}
              />
            </a>
          </div>
        </div>
      </div>

      {/* ===== Основная панель: слева логотип, справа поиск ===== */}
      <div
        className="w-full bg-white border-b border-gray-200"
        style={{ height: MAIN_TOP_H }}
        ref={wrapRef}
      >
        <div className="container mx-auto h-full">
          <div className="flex items-center gap-3 h-full">
            {/* ЛОГО */}
            <Link href="/" className="shrink-0 flex items-center">
              <Image
                src="/logo/logo.webp"
                alt="AKANI — аниме магазин"
                width={63}
                height={40}
                className="w-auto"
                priority
              />
            </Link>

            {/* ПОИСК */}
            <div className="flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => {
                  if (items.length) setOpen(true);
                }}
                className="w-full h-9 rounded-full border border-gray-300 bg-white px-3 text-sm outline-none placeholder:text-gray-400"
                placeholder="Я хочу купить…"
                aria-label="Поиск товара"
              />
            </div>

            <span className="">
              <Image src='/images/svg/heart.svg' alt='Сердце' width={20} height={20} />
            </span>
          </div>
        </div>
      </div>

      {/* === РЕЗУЛЬТАТЫ ПОИСКА: во всю ширину экрана под основной панелью === */}
      {open && (
        <div
          className="fixed left-0 right-0 z-61 bg-white border-t border-gray-200"
          style={{
            top: DROPDOWN_TOP,
            maxHeight: `calc(100vh - ${DROPDOWN_TOP})`,
            overflowY: "auto",
          }}
        >
          <div className="px-3 py-2">
            {loading ? (
              <div className="p-4 text-center text-xs text-gray-500">Ищем…</div>
            ) : !q ? (
              <div className="p-4 text-center text-xs text-gray-500">
                Начните вводить запрос
              </div>
            ) : items.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">
                Ничего не найдено
              </div>
            ) : (
              <div className="p-2">
                {grouped.map((cat) => (
                  <div key={cat.categoryValue} className="mb-4 last:mb-0">
                    {/* Категория */}
                    <Link
                      href={`/${encodeURIComponent(cat.categoryValue)}`}
                      className="block text-sm font-semibold text-gray-900 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      {cat.categoryName}
                    </Link>

                    {cat.sub.map((s) => (
                      <div
                        key={`${cat.categoryValue}/${s.subcategoryValue}`}
                        className="mt-2"
                      >
                        {/* Подкатегория */}
                        <Link
                          href={`/${encodeURIComponent(
                            cat.categoryValue
                          )}/${encodeURIComponent(s.subcategoryValue)}`}
                          className="block text-[13px] font-medium text-gray-700 hover:underline"
                          onClick={() => setOpen(false)}
                        >
                          {s.subcategoryName}
                        </Link>

                        {/* Товары */}
                        <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
                          {s.products.map((p) => (
                            <li
                              key={p.id}
                              className="hover:bg-gray-50 transition"
                            >
                              <Link
                                href={`/${encodeURIComponent(
                                  p.categoryValue
                                )}/${encodeURIComponent(
                                  p.subcategoryValue
                                )}/${encodeURIComponent(p.titleLink)}`}
                                className="flex items-center gap-3 p-2"
                                onClick={() => setOpen(false)}
                              >
                                {/* Картинка */}
                                <div className="w-12 h-12 rounded overflow-hidden border bg-white shrink-0">
                                  {p.thumbnail ? (
                                    <img
                                      src={abs(p.thumbnail)}
                                      alt={p.title}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100" />
                                  )}
                                </div>

                                {/* Текст + цена */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-medium text-gray-900 truncate">
                                    {p.title}
                                  </p>
                                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                    Арт.: {p.article || "—"} · Остаток:{" "}
                                    {p.stock ?? 0}
                                  </p>
                                </div>

                                <div className="text-right whitespace-nowrap text-[13px] font-semibold text-gray-900 pl-2">
                                  {Number(p.price || 0).toFixed(2)} BYN
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

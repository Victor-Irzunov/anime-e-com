"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const abs = (u) =>
  /^https?:\/\//i.test(u || "")
    ? u
    : `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/,"")}${u?.startsWith("/") ? "" : "/"}${u || ""}`;

export default function ModalSearch({ modalVisible, setModalVisible }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    if (!modalVisible) {
      setQ("");
      setItems([]);
      setLoading(false);
    }
  }, [modalVisible]);

  // дебаунс 300мс
  useEffect(() => {
    if (!modalVisible) return;
    if (timer.current) clearTimeout(timer.current);
    if (!q || q.trim().length < 1) { setItems([]); return; }

    timer.current = setTimeout(async () => {
      try {
        setLoading(true);
        const r = await fetch(`/api/product/search?q=${encodeURIComponent(q.trim())}`);
        const j = await r.json();
        setItems(Array.isArray(j?.items) ? j.items : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => timer.current && clearTimeout(timer.current);
  }, [q, modalVisible]);

  const grouped = useMemo(() => {
    // Категория → Подкатегория → товары[]
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

  return (
    <dialog id="search_modal" className={`modal ${modalVisible ? "modal-open" : ""}`}>
      <div className="modal-box max-w-5xl">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setModalVisible(false)}
            aria-label="Закрыть поиск"
          >
            ✕
          </button>
        </form>

        <h3 className="font-semibold text-lg mb-3">Поиск товара</h3>

        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Название, артикул, категория, подкатегория…"
          className="input input-bordered w-full"
        />

        {loading ? (
          <div className="mt-6 text-sm text-gray-500">Ищем…</div>
        ) : !q ? (
          <div className="mt-6 text-sm text-gray-500">Начните вводить запрос</div>
        ) : items.length === 0 ? (
          <div className="mt-6 text-sm text-gray-500">Ничего не найдено</div>
        ) : (
          <div className="mt-5 max-h-[60vh] overflow-y-auto pr-1">
            {grouped.map((cat) => (
              <div key={cat.categoryValue} className="mb-7">
                {/* Заголовок категории — переход в категорию */}
                <div className="flex items-baseline justify-between">
                  <Link
                    href={`/${encodeURIComponent(cat.categoryValue)}`}
                    className="text-lg font-semibold hover:underline"
                    onClick={() => setModalVisible(false)}
                  >
                    {cat.categoryName}
                  </Link>
                </div>

                {cat.sub.map((s) => (
                  <div key={`${cat.categoryValue}/${s.subcategoryValue}`} className="mt-3">
                    {/* Заголовок подкатегории — переход в подкатегорию */}
                    <Link
                      href={`/${encodeURIComponent(cat.categoryValue)}/${encodeURIComponent(s.subcategoryValue)}`}
                      className="text-base font-medium text-gray-700 hover:underline"
                      onClick={() => setModalVisible(false)}
                    >
                      {s.subcategoryName}
                    </Link>

                    {/* СПИСОК товаров */}
                    <ul className="mt-2 divide-y divide-gray-200 border rounded-lg bg-white">
                      {s.products.map((p) => (
                        <li key={p.id} className="hover:bg-gray-50 transition">
                          <Link
                            href={`/${encodeURIComponent(p.categoryValue)}/${encodeURIComponent(p.subcategoryValue)}/${encodeURIComponent(p.titleLink)}`}
                            className="flex items-center gap-3 p-2"
                            onClick={() => setModalVisible(false)}
                          >
                            {/* Миниатюра */}
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

                            {/* Текстовая часть */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{p.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                Арт.: {p.article || "—"} · Остаток: {p.stock ?? 0}
                              </p>
                            </div>

                            {/* Цена справа */}
                            <div className="text-right whitespace-nowrap text-sm font-semibold pl-2">
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
    </dialog>
  );
}

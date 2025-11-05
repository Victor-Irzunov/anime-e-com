// /components/header/SearchInline.client.jsx — НОВЫЙ ФАЙЛ
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function normalizeThumb(thumbnail) {
  if (!thumbnail) return "";
  if (/^https?:\/\//i.test(thumbnail)) return thumbnail;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const path = thumbnail.startsWith("/")
    ? thumbnail
    : thumbnail.startsWith("uploads/")
      ? "/" + thumbnail
      : "/uploads/" + thumbnail;
  return `${base}${path}`;
}

export default function SearchInline() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!q || q.trim().length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/products/search?q=${encodeURIComponent(q)}&take=8`, { cache: "no-store" });
        const j = await res.json().catch(() => ({}));
        const arr = Array.isArray(j?.items) ? j.items : [];
        setItems(arr);
        setOpen(true);
      } catch {
        setItems([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (items.length) {
      const p = items[0];
      const href = `/${encodeURIComponent(p.categoryValue || p.category || "catalog")}/${encodeURIComponent(p.subcategoryValue || p.subcategory || "all")}/${encodeURIComponent(p.titleLink || String(p.id))}`;
      router.push(href);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-2 border rounded-full bg-white px-3 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="text-gray-400">
            <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8l3.5 3.5-1.4 1.4-3.5-3.5A7.48 7.48 0 0 1 10.5 16zM4 10.5A6.5 6.5 0 1 0 10.5 4 6.51 6.51 0 0 0 4 10.5z"/>
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => items.length && setOpen(true)}
            placeholder="Я хочу купить ..."
            className="flex-1 outline-none text-sm bg-transparent"
            aria-label="Поиск товара"
          />
          <button type="submit" className="text-sm text-primary font-semibold">Найти</button>
        </div>
      </form>

      {/* Выпадающий список */}
      {open ? (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg overflow-hidden z-61">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Поиск…</div>
          ) : items.length ? (
            <ul className="max-h-96 overflow-auto divide-y">
              {items.map((p) => {
                const href = `/${encodeURIComponent(p.categoryValue || p.category || "catalog")}/${encodeURIComponent(p.subcategoryValue || p.subcategory || "all")}/${encodeURIComponent(p.titleLink || String(p.id))}`;
                const thumb = normalizeThumb(p.thumbnail);
                return (
                  <li key={p.id}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      <img
                        src={thumb || "/images/banner/banner.webp"}
                        alt={p.title}
                        className="w-10 h-10 rounded object-cover bg-gray-100"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 line-clamp-2">{p.title}</p>
                        <span className="text-xs text-gray-500">
                          {(p.price ?? 0).toFixed(2)} руб
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500">Ничего не найдено</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

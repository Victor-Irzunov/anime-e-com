// /components/Breadcrumbs.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Breadcrumbs({ title }) {
  const path = usePathname();
  const [items, setItems] = useState([]);
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  const queryPath = useMemo(() => {
    // для деталей товара мы всё равно передаём title пропом,
    // но API сам подхватит title из URL и вернёт корректный хвост.
    return path || "/";
  }, [path]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const url = `/api/public/breadcrumbs?path=${encodeURIComponent(queryPath)}`;
        const r = await fetch(url, { cache: "no-store" });
        const j = await r.json();
        if (isMounted && j?.ok) {
          // если в пропе передан title (например на странице товара),
          // добавим в конец крошек этот title (API уже вернёт его тоже — не дублируем)
          setItems(j.items || []);
        }
      } catch (e) {
        console.error("breadcrumbs load error:", e);
      }
    })();
    return () => { isMounted = false };
  }, [queryPath]);

  // Если нужно принудительно добавить последний элемент из пропа title (когда API не знает о нём)
  const finalItems = useMemo(() => {
    if (!title) return items;
    const last = items[items.length - 1];
    if (!last || (last && last.name !== title)) {
      return [...items, { name: title, url: `${base}${path}` }];
    }
    return items;
  }, [items, title, path, base]);

  return (
    <div className="text-sm breadcrumbs sd:px-2 py-2 xz:px-0">
      <ul className="sd:text-sm xz:text-xs">
        {finalItems.map(({ name, url }, idx) => (
          <li key={`${name}-${idx}`}>
            <Link href={url}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Breadcrumbs;

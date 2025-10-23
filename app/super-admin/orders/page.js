// /app/super-admin/orders/page.js — СОЗДАЙ ФАЙЛ ПОЛНОСТЬЮ
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STATUS_OPTIONS = [
  { value: "NEW", label: "Новый" },
  { value: "PROCESSING", label: "В обработке" },
  { value: "SHIPPED", label: "Отправлен" },
  { value: "DELIVERED", label: "Доставлен" },
  { value: "COMPLETED", label: "Завершён" },
  { value: "CANCELED", label: "Отменён" },
  { value: "RETURNED", label: "Возврат" },
  { value: "NOT_DELIVERED", label: "Не забрали" },
];

function parseItems(raw) {
  try {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (typeof raw === "string") {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p;
      if (Array.isArray(p?.data)) return p.data;
    }
    return [];
  } catch {
    return [];
  }
}

function formatDate(dt) {
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders`, { cache: "no-store" });
      const data = await res.json();
      const normalized = Array.isArray(data)
        ? data.map((o) => ({ ...o, items: parseItems(o.orderItems) }))
        : [];
      setOrders(normalized);
    } catch (e) {
      console.error("Ошибка загрузки заказов:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onChangeStatus = async (orderId, next) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error(await res.text());
      // локально обновим
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
      );
    } catch (e) {
      console.error("Не удалось обновить статус:", e);
      alert("Ошибка обновления статуса");
    }
  };

  const filtered = useMemo(() => {
    let list = orders;
    if (filter !== "ALL") {
      list = list.filter((o) => o.status === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          String(o.id).includes(q) ||
          String(o.phone || "").toLowerCase().includes(q) ||
          String(o.email || "").toLowerCase().includes(q) ||
          String(o.address || "").toLowerCase().includes(q) ||
          o.items.some((it) => String(it.title || "").toLowerCase().includes(q))
      );
    }
    return list;
  }, [orders, filter, search]);

  return (
    <section className="py-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold">Заказы (админ)</h1>
          <div className="flex items-center gap-2">
            <Link href="/super-admin" className="btn btn-sm">
              ← В админку
            </Link>
            <button onClick={loadOrders} className="btn btn-sm btn-outline">
              Обновить
            </button>
          </div>
        </div>

        <div className="mt-6 grid sd:grid-cols-3 xz:grid-cols-1 gap-3">
          <div className="form-control">
            <label className="label py-1"><span className="label-text">Фильтр по статусу</span></label>
            <select
              className="select select-bordered select-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">Все</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sd:col-span-2">
            <label className="label py-1"><span className="label-text">Поиск (id, телефон, email, адрес, товар)</span></label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm"
              placeholder="Начните вводить…"
            />
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-gray-500">Загрузка…</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500">Заказы не найдены.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra table-xs w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Создан</th>
                    <th>Покупатель</th>
                    <th>Контакты</th>
                    <th>Адрес</th>
                    <th>Состав заказа</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const sum = o.items.reduce((acc, it) => acc + Number(it.totalAmount || 0), 0);
                    return (
                      <tr key={o.id}>
                        <td className="align-top">{o.id}</td>
                        <td className="align-top whitespace-nowrap">{formatDate(o.createdAt)}</td>
                        <td className="align-top">
                          {o.user?.email || o.email || "-"}
                          <div className="text-gray-500 text-xs">
                            {o.userData?.surname} {o.userData?.name}
                          </div>
                        </td>
                        <td className="align-top text-xs">
                          <div>{o.phone || "-"}</div>
                          {o.email ? <div>{o.email}</div> : null}
                        </td>
                        <td className="align-top text-xs max-w-xs whitespace-pre-wrap">{o.address || "-"}</td>
                        <td className="align-top text-xs">
                          <ul>
                            {o.items.map((it, idx) => (
                              <li key={`${o.id}-${idx}`}>
                                {it.title} — {it.quantity}шт × {Number(it.price).toFixed(2)} ={" "}
                                <b>{Number(it.totalAmount || 0).toFixed(2)} BYN</b>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-1 font-semibold">
                            Итого: {sum.toFixed(2)} BYN
                          </div>
                        </td>
                        <td className="align-top">
                          <select
                            className="select select-bordered select-xs"
                            value={o.status || "NEW"}
                            onChange={(e) => onChangeStatus(o.id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

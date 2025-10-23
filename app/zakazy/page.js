"use client";
import { MyContext } from "@/contexts/MyContextProvider";
import { orderData } from "@/http/userAPI";
import { Empty } from "antd";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";

/** Безопасный парсинг order.orderItems из БД (Json | string | {data:[]}) */
function parseOrderItems(raw) {
  try {
    if (!raw) return [];
    // уже массив
    if (Array.isArray(raw)) return raw;
    // форма { data: [...] } (часто после Prisma Json)
    if (Array.isArray(raw?.data)) return raw.data;
    // строка JSON
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed?.data)) return parsed.data;
      return [];
    }
    // неизвестный объект
    return [];
  } catch {
    return [];
  }
}

const OrdersPage = observer(() => {
  const { user } = useContext(MyContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user.isAuth) {
      orderData().then((data) => {
        // Нормализуем items сразу, чтобы в JSX не было .data.map
        const normalized = Array.isArray(data)
          ? data.map((o) => ({
              ...o,
              items: parseOrderItems(o?.orderItems),
            }))
          : [];
        setOrders(normalized);
      });
    }
  }, [user.isAuth]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const formattedDate = `${padWithZero(dateObj.getDate())}.${padWithZero(
      dateObj.getMonth() + 1
    )}.${dateObj.getFullYear()} ${padWithZero(
      dateObj.getHours()
    )}:${padWithZero(dateObj.getMinutes())}`;
    return formattedDate;
  };

  const padWithZero = (num) => num.toString().padStart(2, "0");

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <h1 className="text-3xl">Ваши заказы</h1>

          {!user.isAuth ? (
            <div className="mt-16">
              <p className="mb-7 text-center">Отсутствуют данные. Вы не авторизованы.</p>
              <Empty />
              <div className="text-center mt-10">
                <button className="btn btn-primary">
                  <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/login`}>Авторизоваться</Link>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {orders.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full mt-8 table table-xs">
                    <thead>
                      <tr>
                        <th className="p-2">Дата создания</th>
                        <th className="p-2">Товары</th>
                        <th className="p-2">Цена</th>
                        <th className="p-2">Количество</th>
                        <th className="p-2">Скидка</th>
                        <th className="p-2">Итого по позициям</th>
                        <th className="p-2">Адрес</th>
                        <th className="p-2">Телефон</th>
                        <th className="p-2">Сообщение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const items = order.items || [];
                        const sumTotal = items.reduce(
                          (acc, it) => acc + Number(it.totalAmount || 0),
                          0
                        );

                        return (
                          <tr key={order.id}>
                            <td className="p-2">{formatDate(order.createdAt)}</td>

                            <td className="p-2">
                              <ul>
                                {items.map((item, idx) => (
                                  <li key={`${item.productId || idx}-t`}>{item.title}</li>
                                ))}
                              </ul>
                            </td>

                            <td className="p-2">
                              <ul>
                                {items.map((item, idx) => (
                                  <li key={`${item.productId || idx}-p`}>
                                    {Number(item.price).toFixed(2)} BYN
                                  </li>
                                ))}
                              </ul>
                            </td>

                            <td className="p-2">
                              <ul>
                                {items.map((item, idx) => (
                                  <li key={`${item.productId || idx}-q`}>{item.quantity}</li>
                                ))}
                              </ul>
                            </td>

                            <td className="p-2">
                              <ul>
                                {items.map((item, idx) => (
                                  <li key={`${item.productId || idx}-d`}>
                                    {Number(item.discountPercentage || 0)}%
                                  </li>
                                ))}
                              </ul>
                            </td>

                            <td className="p-2">
                              <ul>
                                {items.map((item, idx) => (
                                  <li key={`${item.productId || idx}-s`}>
                                    {Number(item.totalAmount || 0).toFixed(2)} BYN
                                  </li>
                                ))}
                                <li className="font-semibold mt-1">
                                  Всего: {sumTotal.toFixed(2)} BYN
                                </li>
                              </ul>
                            </td>

                            <td className="p-2">{order.address || "-"}</td>
                            <td className="p-2">{order.phone || "-"}</td>
                            <td className="p-2">{order.message || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-16">
                  <p className="mb-7 text-center">Пока заказов у вас нет.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default OrdersPage;

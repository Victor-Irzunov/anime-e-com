// /components/UserCart.jsx — ЗАМЕНИТЬ ПОЛНОСТЬЮ
"use client";
import Link from "next/link";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiArrowRightLine,
  RiDeleteBin2Line,
  RiShieldCheckFill,
} from "react-icons/ri";
import CartItem from "@/components/CartItem";
import OrderFormComp from "./Form/OrderFormComp";
import { getOneProduct } from "@/http/adminAPI";
import { MyContext } from "@/contexts/MyContextProvider";

// ——— Константы доставки
const PICKUP_POINTS = [
  { id: "tolstogo", label: "Адрес Толстого 1 , 3 этаж большой островок ТЦ «Минск Сити Молл»." },
  { id: "dzerzh", label: "Адрес Дзержинского 106 , ТЦ «Магнит», 1 этаж , Магазин около бокового входа." },
];

// Базовое состояние доставки
const defaultShipping = {
  method: "europost", // "europost" | "belpost" | "pickup"
  format: "door",     // europost: "door" | "pvz"; belpost: "pvz"; pickup: "-"
  pickupPointId: PICKUP_POINTS[0].id,
};

// ——— Утилиты LS
const loadShipping = () => {
  try { return JSON.parse(localStorage.getItem("shipping") || "null") || defaultShipping; }
  catch { return defaultShipping; }
};
const saveShipping = (s) => {
  try { localStorage.setItem("shipping", JSON.stringify(s)); } catch {}
};

function UserCart({ data, setData }) {
  const { user } = useContext(MyContext);
  const [isActive, setIsActive] = useState(false);
  const orderFormRef = useRef(null);
  const router = useRouter();

  // Состояние доставки
  const [shipping, setShipping] = useState(defaultShipping);

  // Инициализация доставки из LS
  useEffect(() => {
    if (typeof window !== "undefined") setShipping(loadShipping());
  }, []);

  // Скролл к оформлению заказа
  useEffect(() => {
    if (isActive && orderFormRef.current) {
      orderFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isActive]);

  // Товары и корзина
  const handleContinueShopping = () => router.back();

  const handleDeleteProduct = async (productId) => {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCartData = cartData.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCartData));
      const promises = updatedCartData.map(async (item) => {
        const response = await getOneProduct(item.id);
        return { ...response, quantity: item.quantity };
      });
      const updatedProductsData = await Promise.all(promises);
      setData(updatedProductsData);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDecrement = (productId) => {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCartData = cartData.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCartData));
      const updatedProductsData = data.map((product) =>
        product.id === productId ? { ...product, quantity: Math.max(1, product.quantity - 1) } : product
      );
      setData(updatedProductsData);
    } catch (error) {
      console.error("Error decrementing product quantity:", error);
    }
  };

  const handleIncrement = (productId) => {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCartData = cartData.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCartData));
      const updatedProductsData = data.map((product) =>
        product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
      );
      setData(updatedProductsData);
    } catch (error) {
      console.error("Error incrementing product quantity:", error);
    }
  };

  const handleDeleteAll = () => {
    try {
      localStorage.removeItem("cart");
      setData(null);
      setIsActive(false);
    } catch (error) {
      console.error("Error deleting all products:", error);
    }
  };

  // Суммы
  const totalAmount = useMemo(
    () => data.reduce((acc, product) =>
      acc + (product.price * product.quantity) + (product.price * product.quantity * product.discountPercentage) / 100, 0),
    [data]
  );
  const discountAmount = useMemo(
    () => data.reduce((acc, product) => acc + ((product.price / 100) * product.discountPercentage) * product.quantity, 0),
    [data]
  );
  const finalTotal = totalAmount - discountAmount;

  // ——— Логика доставки
  const setAndSaveShipping = (next) => { setShipping(next); saveShipping(next); };
  const onSelectMethod = (method) => {
    if (method === "europost") setAndSaveShipping({ method, format: "door", pickupPointId: null });
    else if (method === "belpost") setAndSaveShipping({ method, format: "pvz", pickupPointId: null });
    else setAndSaveShipping({ method, format: "-", pickupPointId: PICKUP_POINTS[0].id });
  };
  const onSelectEuropostFormat = (format) => setAndSaveShipping({ ...shipping, method: "europost", format, pickupPointId: null });
  const onSelectPickupPoint = (pickupPointId) => setAndSaveShipping({ ...shipping, method: "pickup", format: "-", pickupPointId });

  const shippingHuman = useMemo(() => {
    if (shipping.method === "europost") {
      return { method: "Доставка Европочтой", format: shipping.format === "door" ? "До двери" : "До пункта выдачи",
        details: "Стоимость доставки от 8р до 13р, при заказе от 100 рублей — доставка бесплатно" };
    }
    if (shipping.method === "belpost") {
      return { method: "Белпочтой", format: "До пункта выдачи",
        details: "Стоимость доставки от 5р до 12р, при заказе от 100 рублей — доставка бесплатно" };
    }
    const point = PICKUP_POINTS.find((p) => p.id === shipping.pickupPointId);
    return { method: "Самовывоз", format: point ? point.label : "", details: "Оплата онлайн или на месте." };
  }, [shipping]);

  const handleCheckoutClick = () => setIsActive(true);

  return (
    <div className="my-2">
      <h3 className="mb-4 text-xl font-medium">Корзина ({data.length})</h3>

      <div className="flex sd:flex-row xz:flex-col gap-6 mb-10">
        {/* Левая колонка: товары + доставка */}
        <div className="flex-1 rounded-lg border border-gray-300 p-4 bg-white flex flex-col gap-6">
          {data.map((el) => (
            <CartItem
              product={el}
              key={el.id}
              onDelete={handleDeleteProduct}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
            />
          ))}

          {/* Действия */}
          <div className="mt-2 flex sd:flex-row xz:flex-col justify-between">
            <button className="btn btn-sm btn-error btn-outline capitalize sd:mb-0 xz:mb-5" onClick={handleDeleteAll}>
              <RiDeleteBin2Line fontSize={20} /> Удалить всё
            </button>
            <button className="btn btn-sm btn-secondary btn-outline capitalize" onClick={handleContinueShopping}>
              Продолжить покупки <RiArrowRightLine fontSize={20} />
            </button>
          </div>

          {/* Выбор доставки */}
          <h4 className="text-lg font-semibold mt-2">Выберите способ доставки</h4>

          {/* Европочтой */}
          <div className="rounded-xl border bg-gray-50 border-gray-200 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="shipMethod" className="radio radio-secondary"
                     checked={shipping.method === "europost"} onChange={() => onSelectMethod("europost")} />
              <span className="font-medium">Доставка Европочтой</span>
            </label>
            <div className="mt-3 text-sm text-gray-600">Формат доставки:</div>
            <div className="mt-2">
              <div className="join w-full max-w-xl">
                <button type="button"
                        className={`join-item btn btn-sm ${shipping.method === "europost" && shipping.format === "door" ? "btn-secondary" : "btn-outline"}`}
                        onClick={() => onSelectEuropostFormat("door")}>До двери</button>
                <button type="button"
                        className={`join-item btn btn-sm ${shipping.method === "europost" && shipping.format === "pvz" ? "btn-secondary" : "btn-outline"}`}
                        onClick={() => onSelectEuropostFormat("pvz")}>До пункта выдачи</button>
              </div>
            </div>
          </div>

          {/* Белпочтой */}
          <div className="rounded-xl border bg-gray-50 border-gray-200 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="shipMethod" className="radio radio-secondary"
                     checked={shipping.method === "belpost"} onChange={() => onSelectMethod("belpost")} />
              <span className="font-medium">Белпочтой</span>
            </label>
            <div className="mt-3 text-sm text-gray-600">Формат доставки:</div>
            <div className="mt-2">
              <div className="join w-full max-w-xl">
                <button type="button" className="join-item btn btn-sm btn-secondary" disabled>До пункта выдачи</button>
              </div>
            </div>
          </div>

          {/* Самовывоз */}
          <div className="rounded-xl border bg-gray-50 border-gray-200 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="shipMethod" className="radio radio-secondary"
                     checked={shipping.method === "pickup"} onChange={() => onSelectMethod("pickup")} />
              <span className="font-medium">Самовывоз</span>
            </label>
            <div className="mt-3 text-sm text-gray-600">Пункт самовывоза:</div>
            <div className="mt-2 grid gap-2">
              {PICKUP_POINTS.map((p) => (
                <label key={p.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="pickupPoint" className="radio radio-sm radio-secondary"
                         disabled={shipping.method !== "pickup"}
                         checked={shipping.method === "pickup" && shipping.pickupPointId === p.id}
                         onChange={() => onSelectPickupPoint(p.id)} />
                  <span className="text-sm">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Правая колонка: сводка/промокод */}
        <div className="sd:w-80 xz:w-full flex flex-col gap-6">
          {/* Промокод */}
          <div className="rounded-lg border border-gray-300 p-4 bg-white text-gray-600 flex flex-col">
            <span className="pb-2">Есть промокод?</span>
            <div className="join">
              <input type="text" className="w-full input input-bordered input-sm join-item" placeholder="Введите код" />
              <button className="join-item btn btn-sm btn-outline">Применить</button>
            </div>
          </div>

          {/* Сводка */}
          <div className="rounded-lg border border-gray-300 p-4 bg-white text-gray-700 flex flex-col gap-2">
            <div className="flex items-center justify-between"><span>Сумма покупки:</span><span>{totalAmount.toFixed(2)} руб</span></div>
            <div className="flex items-center justify-between"><span>Скидка:</span><span>- {discountAmount.toFixed(2)} руб</span></div>
            <hr className="my-2" />
            <div className="text-sm text-gray-500">Страна доставки:</div><div className="text-sm">Беларусь</div>
            <div className="text-sm text-gray-500 mt-2">Способ доставки:</div><div className="text-sm">{shippingHuman.method}</div>
            <div className="text-sm text-gray-500 mt-2">Формат доставки:</div><div className="text-sm">{shippingHuman.format}</div>
            {shippingHuman.details ? <div className="text-xs text-gray-500 mt-2">{shippingHuman.details}</div> : null}
            <hr className="my-3" />
            <div className="flex items-center justify-between font-semibold my-2">
              <span>Итого:</span><span>{finalTotal.toFixed(2)} руб.</span>
            </div>
            <button className="btn btn-secondary capitalize text-base" onClick={handleCheckoutClick}>
              Оформить покупку
            </button>
            <div className="pt-4 flex items-center gap-3 text-xs text-gray-500">
              <RiShieldCheckFill fontSize={22} /> Быстрая доставка. Простой возврат.
            </div>
          </div>
        </div>
      </div>

      {/* Форма оформления заказа — ТЕПЕРЬ ВСЕГДА ДОСТУПНА (гость/авторизован) */}
      {isActive ? (
        <OrderFormComp
          ref={orderFormRef}
          data={data}
          setIsActive={setIsActive}
          shipping={shipping}
        />
      ) : null}
    </div>
  );
}

export default UserCart;

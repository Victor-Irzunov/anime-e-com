// /components/Form/QuickBuyForm.jsx — НОВЫЙ ФАЙЛ
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import PhoneInput from "@/components/Form/MaskPhone/PhoneInput";

/**
 * Быстрая покупка: минимальная форма.
 * Поля:
 *  - name (необязательно)
 *  - phone (обязательно)
 *
 * Отправляет на /api/checkout/guest с безопасными дефолтами.
 * Требует props:
 *  - product: объект товара (id, title, price, discountPercentage)
 *  - quantity: число (>=1)
 *  - onClose(): закрыть модалку
 */
export default function QuickBuyForm({ product, quantity = 1, onClose }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [alertText, setAlertText] = useState("");

  const total = useMemo(() => {
    if (!product) return 0;
    return Number(product.price || 0) * Number(quantity || 1);
  }, [product, quantity]);

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test((v || "").trim());
  const validate = () => {
    const digits = tel.replace(/\D/g, "");
    const validOperators = ["29", "33", "44", "25"];
    const operatorCode = digits.slice(3, 5);
    if (!(digits.length === 12 && digits.startsWith("375") && validOperators.includes(operatorCode))) {
      setAlertText("Введите номер вида +375 xx xxx-xx-xx (коды: 29, 33, 44, 25).");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 3500);
      return;
    }

    // Собираем минимальный заказ (1 позиция — текущий товар)
    const orderItems = [{
      productId: product.id,
      title: product.title,
      quantity: Number(quantity || 1),
      discountPercentage: Number(product.discountPercentage || 0),
      price: Number(product.price || 0),
      totalAmount: Number(product.price || 0) * Number(quantity || 1),
    }];

    // Безопасные дефолты для совместимости с бекендом
    const payload = {
      // гость
      email: "quick@akani.by", // заглушка
      surname: "",             // необязательно для "быстрой"
      name: name || "",        // из формы
      patronymic: "",          // необязательно
      phone: tel,              // ОБЯЗАТЕЛЬНО
      // адрес и пр.
      address: "-",            // чтобы не падала валидация адреса на сервере
      addressFields: null,
      comment: `Быстрая покупка: ${product.title} × ${quantity}.`,
      // доставки нет на этом шаге — выберут позже
      shipping: { method: null, format: null, pickupPointId: null },
      orderItems,
    };

    try {
      const res = await fetch("/api/checkout/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order failed");
      const dataResp = await res.json();

      if (dataResp?.token) localStorage.setItem("token_e_com", dataResp.token);
      if (dataResp?.passwordResetToken) localStorage.setItem("pwd_reset_token", dataResp.passwordResetToken);

      // Очистка корзины НЕ требуется (оформление по 1 товару вне корзины)
      if (typeof onClose === "function") onClose();
      router.push("/thank-you");
    } catch (err) {
      setAlertText("Ошибка при оформлении. Попробуйте позже.");
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 3500);
    }
  };

  return (
    <form onSubmit={submit} className="w-full text-[14px] sd:text-[13px]">
      {alertActive && (
        <div role="alert" className="alert alert-warning text-sm mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 9v2m0 4h.01M4.06 20h15.88c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L2.33 17c-.77 1.33.19 3 1.73 3Z"/>
          </svg>
          <span>{alertText}</span>
        </div>
      )}

      <div className="mb-2 text-sm text-gray-600">
        Заказ: <span className="font-medium">{product?.title}</span> · <span>{quantity} шт.</span> ·{" "}
        <span className="font-medium">{total.toFixed(2)} руб</span>
      </div>

      {/* Имя — необязательное */}
      <div className="form-control mb-3">
        <label className="label py-1">
          <span className="label-text text-gray-600">Ваше имя (необязательно)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Имя"
          autoComplete="given-name"
        />
      </div>

      {/* Телефон — обязательный */}
      <div className="form-control flex flex-col mb-4">
        <label className="label py-1">
          <span className="label-text text-gray-600">Ваш телефон<span className="text-error">*</span></span>
        </label>
        <div className="input input-bordered input-sm rounded-lg px-0">
          <div className="w-full">
            <PhoneInput value={tel} onChange={setTel} setAlertText={setAlertText} setAlertActive={setAlertActive}/>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-secondary btn-sm sd:btn-md rounded-lg uppercase tracking-wide w-full">
        Оформить быстро
      </button>
    </form>
  );
}

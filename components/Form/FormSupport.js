"use client";

import { sendOrderTelegram } from "@/http/telegramAPI";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "./MaskPhone/PhoneInput";

const FormSupport = ({ selectedProduct, setIsFormSubmitted, closeModal, btn = "Отправить" }) => {
  const [tel, setTel] = useState("+375 ");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);
  const phoneRef = useRef(null);

  useEffect(() => {
    // автофокус на мобиле
    phoneRef.current?.querySelector("input")?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const telDigitsOnly = tel.replace(/\D/g, "");
    if (telDigitsOnly.length !== 12) {
      setErr("Введите номер в формате: +375 XX XXX-XX-XX");
      return;
    }
    setPending(true);

    const text =
      `<b>Заявка с сайта «Акани»</b>\n` +
      `<b>Тип:</b> ${selectedProduct || "Форма связи"}\n` +
      `<b>Телефон:</b> <a href='tel:${tel}'>${tel}</a>\n` +
      `<b>Сообщение:</b> ${message || "—"}`;

    try {
      const r = await sendOrderTelegram(text);
      if (r?.ok) {
        setIsFormSubmitted?.(true);
        // опционально закрыть модалку через 2 сек.
        setTimeout(() => closeModal?.(), 1800);
      } else {
        setErr("Не удалось отправить. Попробуйте ещё раз.");
      }
    } catch {
      setErr("Сбой сети. Проверьте соединение.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full sd:px-2 sd:py-2 xz:px-0 xz:py-0">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control mt-2" ref={phoneRef}>
          <label className="label flex justify-between py-1">
            <span className="label-text">Телефон (xx xxx-xx-xx)</span>
            <span className="label-text-alt text-[10px]">Обязательно</span>
          </label>
          <PhoneInput value={tel} onChange={setTel} />
        </div>

        <div className="form-control">
          <label className="label flex justify-between py-1">
            <span className="label-text">Сообщение</span>
            <span className="label-text-alt text-[10px]">Необязательно</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            placeholder="Кого ищете, серия/персонаж, бюджет…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {err && <div className="text-red-600 text-xs">{err}</div>}

        <label className="flex items-start gap-2 text-xs">
          <input
            type="checkbox"
            className="checkbox checkbox-sm bg-white mt-0.5"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            Я согласен(на) на{" "}
            <Link href="/politika" target="_blank" className="underline">
              обработку персональных данных
            </Link>
            .
          </span>
        </label>

        <button
          className="btn btn-secondary font-bold text-white uppercase w-full"
          type="submit"
          disabled={!agree || pending}
        >
          {pending ? "Отправка…" : btn}
        </button>
      </form>
    </div>
  );
};

export default FormSupport;

// /app/thank-you/page.js — ЗАМЕНИТЬ ПОЛНОСТЬЮ (очистка корзины + кнопка «Создать пароль»)
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const [hasReset, setHasReset] = useState(false);

  useEffect(() => {
    // корзина уже чистится на форме, но продублируем на всякий случай
    try { localStorage.removeItem("cart"); } catch {}

    // есть ли токен сброса пароля
    try {
      const t = localStorage.getItem("pwd_reset_token");
      setHasReset(Boolean(t));
    } catch {}
  }, []);

  const goCreatePassword = () => {
    router.push("/set-password");
  };

  return (
    <main className="xz:min-h-[80vh] sd:min-h-screen pt-14">
      <section className="relative">
        <div className="container mx-auto">
          <h1 className="sd:text-5xl xz:text-3xl font-semibold text-shadow">
            Спасибо! Ваш заказ принят.
          </h1>
          <p className="sd:text-3xl xz:text-xl mt-4 text-shadow">
            Мы свяжемся с вами для подтверждения.
          </p>

          {hasReset ? (
            <div className="mt-6 p-4 rounded-xl border bg-white/80 max-w-lg">
              <p className="mb-3 text-sm">
                Создайте пароль, чтобы отслеживать заказы и быстрее оформлять покупки.
              </p>
              <button className="btn btn-secondary" onClick={goCreatePassword}>
                Создать пароль
              </button>
            </div>
          ) : null}

          <div className="mt-8">
            <Link href="/" className="underline">На главную</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

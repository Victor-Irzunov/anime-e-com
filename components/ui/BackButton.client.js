"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className = "", children = "← Назад" }) {
  const router = useRouter();

  const handleClick = () => {
    // если истории нет (вошли по прямой ссылке) — идём на главную
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-ghost ${className}`}
      onClick={handleClick}
      aria-label="Назад"
    >
      {children}
    </button>
  );
}

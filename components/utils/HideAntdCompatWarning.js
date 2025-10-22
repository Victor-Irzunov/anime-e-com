"use client";

import { useEffect } from "react";

/**
 * Фильтруем только предупреждение совместимости antd с React 19 через console.warn.
 * Не трогаем console.error, чтобы не ловить рекурсию дев-оверлея.
 * Патч — глобальный и выполняется один раз на страницу/HMR-сессию.
 */
export default function HideAntdCompatWarning() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Глобовый флаг, чтобы не патчить повторно (учитывает StrictMode/HMR)
    if (window.__ANTD_WARN_PATCHED__) return;
    window.__ANTD_WARN_PATCHED__ = true;

    const origWarn = console.warn.bind(console);
    const filter = (args) =>
      typeof args?.[0] === "string" && args[0].includes("[antd: compatible]");

    console.warn = (...args) => {
      if (filter(args)) return; // глушим только это предупреждение
      origWarn(...args);
    };

    // ВАЖНО: не делаем cleanup — иначе StrictMode откатит патч
  }, []);

  return null;
}

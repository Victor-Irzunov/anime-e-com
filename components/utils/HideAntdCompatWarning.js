// /components/utils/HideAntdCompatWarning.jsx
"use client";

import { useEffect, useRef } from "react";

/**
 * Глушим ТОЛЬКО предупреждение совместимости antd с React 19,
 * без рекурсий и утечек. Работает один раз на страницу.
 */
export default function HideAntdCompatWarning() {
  const patched = useRef(false);

  useEffect(() => {
    if (patched.current) return;
    patched.current = true;

    // фиксируем оригинальные методы ДО переопределения
    const origWarn = console.warn.bind(console);
    const origError = console.error.bind(console);

    const filter = (args) =>
      typeof args?.[0] === "string" && args[0].includes("[antd: compatible]");

    console.warn = (...args) => {
      if (filter(args)) return; // фильтруем только это предупреждение
      origWarn(...args);
    };

    console.error = (...args) => {
      if (filter(args)) return; // если antd шлёт через error — тоже глушим
      origError(...args);
    };

    return () => {
      console.warn = origWarn;
      console.error = origError;
    };
  }, []);

  return null;
}

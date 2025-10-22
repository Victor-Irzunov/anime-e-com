// /components/ui/GlobalToast.jsx — ГЛОБАЛЬНЫЕ ТОСТЫ (fixed top, z-[9999])
"use client";

import { useEffect, useRef, useState } from "react";

const palette = {
  success: "bg-emerald-600 border-emerald-700 text-white",
  error:   "bg-rose-600   border-rose-700   text-white",
  warning: "bg-amber-500  border-amber-600  text-black",
  info:    "bg-slate-800  border-slate-700  text-white",
};

export default function GlobalToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(() => {
    const handler = (e) => {
      const d = e?.detail || {};
      const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const toast = {
        id,
        type: d.type || "info",              // success | error | warning | info
        title: d.title || "",
        content: d.content || "",
        duration: Number.isFinite(d.duration) ? d.duration : (d.type === "error" ? 5000 : 3000),
      };
      setToasts((prev) => [...prev, toast]);

      const t = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
        timersRef.current.delete(id);
      }, toast.duration);
      timersRef.current.set(id, t);
    };

    window.addEventListener("app:toast", handler);
    return () => {
      window.removeEventListener("app:toast", handler);
      // cleanup
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const close = (id) => {
    const t = timersRef.current.get(id);
    if (t) clearTimeout(t);
    timersRef.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="fixed inset-x-0 top-3 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-xl px-3 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto border rounded-xl shadow-xl ${palette[t.type]} overflow-hidden`}
          >
            <div className="flex items-start gap-3 p-3">
              <div className="pt-0.5">
                {t.type === "success" && <span aria-hidden>✅</span>}
                {t.type === "error"   && <span aria-hidden>⛔</span>}
                {t.type === "warning" && <span aria-hidden>⚠️</span>}
                {t.type === "info"    && <span aria-hidden>ℹ️</span>}
              </div>
              <div className="flex-1">
                {t.title ? <div className="font-semibold leading-tight">{t.title}</div> : null}
                {t.content ? <div className="text-sm opacity-90">{t.content}</div> : null}
              </div>
              <button
                onClick={() => close(t.id)}
                className="ml-2 rounded-md/50 px-2 text-sm opacity-80 hover:opacity-100 transition"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

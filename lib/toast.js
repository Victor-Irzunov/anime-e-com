// /lib/toast.js — УТИЛИТЫ ДЛЯ ВЫЗОВА ТОСТОВ (без провайдеров)
export function showToast(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app:toast", { detail }));
}

export const toastSuccess = (content, title = "Готово") =>
  showToast({ type: "success", title, content });

export const toastError = (content, title = "Ошибка") =>
  showToast({ type: "error", title, content });

export const toastWarning = (content, title = "Внимание") =>
  showToast({ type: "warning", title, content });

export const toastInfo = (content, title = "Сообщение") =>
  showToast({ type: "info", title, content });

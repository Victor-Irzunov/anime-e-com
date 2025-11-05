"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { RiCloseLine } from "react-icons/ri";
import { AiTwotoneHome } from "react-icons/ai";

/**
 * Офф-канвас меню на React (без чекбоксов DaisyUI).
 * Открывается СЛЕВА: left-0, скрытое состояние — -translate-x-full.
 * Управление: глобальное событие window "ui:drawer" с detail { open: true|false }.
 * Слои: нижний бар z-30 (в другом компоненте), overlay z-40, панель z-50.
 */

const NavBarMobil = ({ menu = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Открыть/закрыть по глобальному событию
  useEffect(() => {
    const handler = (e) => {
      const open = e?.detail?.open ?? true;
      setIsOpen(!!open);
      document.documentElement.classList.toggle("overflow-hidden", !!open);
    };
    window.addEventListener("ui:drawer", handler);
    return () => {
      window.removeEventListener("ui:drawer", handler);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.documentElement.classList.remove("overflow-hidden");
    try {
      if (navigator?.vibrate) navigator.vibrate(5);
    } catch {}
  }, []);

  // Закрытие по ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <nav className="xz:block sd:hidden overflow-x-hidden">
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* панель слева */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-80 sd:w-[500px] bg-base-200 text-base-content shadow-xl
        transform transition-transform duration-300 will-change-transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {/* Крестик — слева сверху */}
        <div className="absolute top-3 right-3">
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть меню"
            className="btn btn-ghost btn-circle"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="px-4 pt-14 pb-6 font-medium">
          <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/`}
            className="text-xl flex items-center gap-2"
            onClick={close}
          >
            <AiTwotoneHome fontSize={26} />
            <span>Главная</span>
          </Link>
        </div>

        <div className="px-4">
          <p className="sd:text-xl xz:text-lg font-semibold mb-3">Все категории</p>

          <div className="space-y-2">
            {menu.map((el) => (
              <details className="collapse collapse-plus bg-base-200" key={el.id}>
                <summary className="collapse-title sd:text-xl xz:text-base font-medium">
                  <Link href={`/${el.value}`} className="underline" onClick={close}>
                    {el.name}
                  </Link>
                </summary>

                {(el.subcategories || []).map((sub) => (
                  <div className="collapse-content flex items-center" key={sub.id}>
                    <Link
                      href={`/${el.value}/${sub.value}`}
                      className="ml-1 underline"
                      onClick={close}
                    >
                      {sub.name}
                    </Link>
                  </div>
                ))}
              </details>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={close}
              className="btn btn-primary w-full"
              aria-label="Закрыть меню"
            >
              Закрыть
            </button>
          </div>
        </div>
      </aside>
    </nav>
  );
};

export default NavBarMobil;

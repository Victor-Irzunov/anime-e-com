"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Ленивая встраиваемая карта.
 * - По умолчанию карта подгружается ТОЛЬКО по клику (mode="click").
 * - Можно включить автоподгрузку при появлении в вьюпорте: mode="visible".
 * - Никаких внешних скриптов пока не будет => лучшая оценка PSI.
 */
export default function MapCard({
  title,
  address,
  // Полный URL <iframe src="..."> от Google/Yandex/OSM
  embedUrl,
  // картинка-заглушка (скрин, баннер) — положи в /public или дай внешний URL
  placeholderSrc = "/images/map-placeholder.webp",
  placeholderAlt = "Открыть карту",
  mode = "click", // "click" | "visible"
  className = "",
  height = 320,
}) {
  const [showMap, setShowMap] = useState(false);
  const boxRef = useRef(null);

  // Автоподгрузка при прокрутке (если нужно)
  useEffect(() => {
    if (mode !== "visible" || showMap === true || !boxRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShowMap(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(boxRef.current);
    return () => io.disconnect();
  }, [mode, showMap]);

  return (
    <div
      ref={boxRef}
      className={`rounded-2xl overflow-hidden border border-gray-200 bg-white ${className}`}
    >
      <div className="p-4">
        {title ? <h3 className="font-semibold">{title}</h3> : null}
        {address ? <p className="text-sm text-gray-600">{address}</p> : null}
      </div>

      {/* Карта: либо placeholder, либо iframe */}
      <div className="relative w-full" style={{ height }}>
        {!showMap ? (
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="group w-full h-full relative text-left"
            aria-label="Показать интерактивную карту"
          >
            {/* безопасный, лёгкий плейсхолдер */}
            <Image
              src={placeholderSrc}
              alt={placeholderAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={false}
            />
            {/* затемнение + CTA */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="px-4 py-2 rounded-xl bg-white/95 text-gray-900 text-sm shadow">
                Показать карту
              </span>
            </div>
          </button>
        ) : (
          <iframe
            title={title || "Карта"}
            src={embedUrl}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

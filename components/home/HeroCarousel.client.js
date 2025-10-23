"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { useMemo } from "react";

const responsive = {
  desktop: { breakpoint: { max: 4000, min: 1280 }, items: 1 },
  tablet:  { breakpoint: { max: 1280, min: 640  }, items: 1 },
  mobile:  { breakpoint: { max: 640,  min: 0    }, items: 1 },
};

// Кнопки навигации
function ArrowBtn({ onClick, left }) {
  return (
    <button
      aria-label={left ? "Предыдущий баннер" : "Следующий баннер"}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 z-20 grid place-items-center
                  h-10 w-10 rounded-full bg-white/90 shadow hover:bg-white
                  ${left ? "left-3" : "right-3"}`}
    >
      <span className="text-xl leading-none">{left ? "‹" : "›"}</span>
    </button>
  );
}

export default function HeroCarousel() {
  // список баннеров (можно расширять)
  const slides = useMemo(
    () => [
      { src: "/images/banner/banner.webp",   alt: "AKANI — баннер 1" },
      { src: "/images/banner/banner-2.webp", alt: "AKANI — баннер 2" },
    ],
    []
  );

  if (!slides.length) return null;

  return (
    <div className="relative">
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={4000}
        pauseOnHover
        arrows
        customLeftArrow={<ArrowBtn left />}
        customRightArrow={<ArrowBtn />}
        itemClass="px-0"
        containerClass="rounded-2xl overflow-hidden"
        ssr
        keyBoardControl
        showDots={false}
        swipeable
        draggable
      >
        {slides.map((s, i) => (
          <div key={i} className="relative w-full min-h-[220px] sd:min-h-[360px] xl:min-h-[480px]">
            {/* Баннер 21:9 с адаптивной высотой */}
            <div className="relative w-full "
                 style={{ aspectRatio: "21 / 9" }}>
              {/* На малых экранах делаем повыше за счёт minHeight */}
              <div className="absolute inset-0 min-h-[220px] sd:min-h-[360px] xl:min-h-[480px]">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={i === 0}       // первый грузим приоритетно
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

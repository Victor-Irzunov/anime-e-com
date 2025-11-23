// /components/home/MagnitGallery.jsx
"use client";

import Image from "next/image";

const IMAGES = Array.from({ length: 9 }, (_, i) => i + 1);

export default function MagnitGallery() {
  return (
    <section className="container mx-auto sd:py-14 xz:py-8 sd:px-0 xz:px-3">
      <div className="mb-8">
        <h2 className="font-semibold text-[clamp(22px,6vw,36px)]">
          <span
            style={{
              background: "linear-gradient(90deg,#27E9E2,#1C7EEC)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Магазин&nbsp; ТЦ «Магнит»
          </span>
        </h2>
        <p className="mt-2 text-gray-600 sd:text-base xz:text-sm max-w-prose">
          Живые фото островка «Акани» в ТЦ «Магнит» (пр-т Дзержинского, 106). Так
          выглядит витрина с фигурками, мерчем и мягкими игрушками.
        </p>
      </div>

      <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-4">
        {IMAGES.map((n) => (
          <div
            key={n}
            className="rounded-xl overflow-hidden border border-gray-200 bg-white"
          >
            <Image
              src={`/magnit/${n}.webp`}
              alt={`Магазин ТЦ «Магнит» — фото ${n}`}
              width={600}
              height={600}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

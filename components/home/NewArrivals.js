// /components/home/NewArrivals.jsx
import Link from "next/link";
import ProductsCarouselClient from "@/components/home/ProductsCarousel.client";

async function getNewest() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = `${base}/api/product?new=1&days=10`;
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  const arr = Array.isArray(j?.items) ? j.items : Array.isArray(j) ? j : [];
  return arr.slice(0, 20);
}

export default async function NewArrivals() {
  const items = await getNewest();
  if (!items.length) return null;

  return (
    <section className="container mx-auto sd:py-10 xz:py-8 sd:px-0 xz:px-3">
      <h2 className="sd:text-5xl xz:text-3xl font-normal mb-6">Новинки</h2>
      <ProductsCarouselClient items={items} />
      <div className="mt-4 flex justify-end">
        <Link
          href="/novinki"
          prefetch={false}
          className="inline-flex items-center gap-2 text-secondary hover:opacity-80"
          aria-label="Все новинки за 10 дней"
        >
          Перейти на страницу новинок
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="-mr-0.5">
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

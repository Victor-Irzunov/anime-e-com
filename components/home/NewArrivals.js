// /components/home/NewArrivals.jsx
import ProductsCarouselClient from "@/components/home/ProductsCarousel.client";

async function getNewest() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/product`, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  const arr = Array.isArray(j?.items) ? j.items : Array.isArray(j) ? j : [];
  return arr.slice(0, 20); // уже отсортировано по createdAt desc на бэке
}

export default async function NewArrivals() {
  const items = await getNewest();
  if (!items.length) return null;

  return (
    <section className="container mx-auto sd:py-10 xz:py-8 sd:px-0 xz:px-3">
      <h2 className="sd:text-5xl xz:text-3xl font-normal mb-6">Новинки</h2>
      <ProductsCarouselClient items={items} />
    </section>
  );
}

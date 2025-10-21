// /components/home/PopularProducts.jsx
import ProductsCarouselClient from "@/components/home/ProductsCarousel.client";

async function getPopular() {
  // пробуем специальный роут, если он есть
  try {
    const r1 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/product/recommended`, { cache: "no-store" });
    if (r1.ok) {
      const j = await r1.json().catch(() => []);
      return Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
    }
  } catch {}
  // fallback: берём все и фильтруем
  try {
    const r2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/product`, { cache: "no-store" });
    const j = await r2.json().catch(() => ({}));
    const arr = Array.isArray(j?.items) ? j.items : Array.isArray(j) ? j : [];
    return arr.filter((p) => Boolean(p.recommended));
  } catch {
    return [];
  }
}

export default async function PopularProducts() {
  const items = await getPopular();
  if (!items.length) return null;

  return (
    <section className="container mx-auto sd:py-10 xz:py-8 sd:px-0 xz:px-3">
      <h2 className="sd:text-5xl xz:text-3xl font-normal mb-6">Популярное</h2>
      <ProductsCarouselClient items={items} />
    </section>
  );
}

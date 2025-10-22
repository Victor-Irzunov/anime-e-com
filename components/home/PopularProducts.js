// /components/home/PopularProducts.jsx
import ProductsCarouselClient from "@/components/home/ProductsCarousel.client";

async function getPopular() {
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/product/popular`, { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    return Array.isArray(j?.items) ? j.items : Array.isArray(j) ? j : [];
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

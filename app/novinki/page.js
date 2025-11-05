// /app/novinki/page.jsx
import ProductList from "@/components/ProductList";
import Script from "next/script";

const DAYS = 10;

function abs(u) {
  const b = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  if (!u) return undefined;
  return /^https?:\/\//i.test(u) ? u : `${b}${u.startsWith("/") ? "" : "/"}${u}`;
}

export async function generateMetadata() {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  const title = `Новинки за последние ${DAYS} дней — купить с доставкой по Беларуси`;
  const description = `Каталог новых поступлений за последние ${DAYS} дней: свежие товары, актуальные цены, быстрая доставка по Беларуси.`;
  const canonical = `${base}/novinki`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [],
    },
  };
}

async function getNewItems() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const r = await fetch(`${base}/api/product?new=1&days=${DAYS}`, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  return Array.isArray(j?.items) ? j.items : [];
}

export default async function Page() {
  const items = await getNewItems();
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Новинки (${DAYS} дней)`,
    itemListElement: items.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/${encodeURIComponent(p.categoryValue || p.category || "catalog")}/${encodeURIComponent(p.subcategoryValue || p.subcategory || "all")}/${encodeURIComponent(p.titleLink || String(p.id))}`,
      name: p.h1 || p.title,
    })),
  };

  return (
    <main className="container mx-auto sd:py-20 xz:py-8 sd:px-0 xz:px-3">
		  <h1
			  className="sd:text-4xl xz:text-2xl font-semibold mb-12"
			   style={{ background: "linear-gradient(90deg,#27E9E2,#1C7EEC)", WebkitBackgroundClip: "text", color: "transparent" }}
		  >
        Новинки
      </h1>

      {!items.length ? (
        <p className="text-gray-500">За последние {DAYS} дней новые товары не добавлялись.</p>
      ) : (
        <ProductList products={items} isListView={false} />
      )}

      {/* JSON-LD ItemList для AEO */}
      <Script id="ld-novinki" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
    </main>
  );
}

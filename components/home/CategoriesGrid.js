import Link from "next/link";

async function getCats() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/catalog/categories`, { cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  return Array.isArray(j?.items) ? j.items : [];
}

export default async function CategoriesGrid() {
  const cats = await getCats();
  if (!cats.length) return null;

  return (
    <section className="container mx-auto sd:py-10 xz:py-6 sd:px-0 xz:px-3">
      <div className="grid sd:grid-cols-3 xz:grid-cols-2 gap-4 sd:gap-6">
        {cats.map((c) => {
          const base = process.env.NEXT_PUBLIC_BASE_URL || "";
          const img = c.image ? `${base}/uploads/${c.image}` : "/placeholder-cat.webp";
          const count = c.productsCount ?? c._count?.products ?? 0;

          return (

            <Link
              href={`/${c.value}`}
              key={c.id}
              className=""
              aria-label={`Перейти в каталог категории ${c.name}`}
            >
              <article className="group">
                {/* Изображение */}
                <div className="relative w-full sd:h-[220px] xz:h-40 overflow-hidden rounded-2xl">
                  <img
                    src={img}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Под изображением: h3 и ссылка — центрируем, без теней и бордеров */}
                <div className="pt-3 flex flex-col items-center text-center">
                  <h3 className="font-semibold tracking-wide text-[15px] sd:text-[16px] uppercase text-secondary">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-[13px] sd:text-[14px] text-primary">{count} товаров</p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section >
  );
}

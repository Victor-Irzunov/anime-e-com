// /components/home/CategoriesGrid.jsx
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
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        {cats.map((c) => {
          const img = c.image ? `${process.env.NEXT_PUBLIC_BASE_URL || ""}/uploads/${c.image}` : "/placeholder-cat.webp";
          return (
            <div key={c.id} className="relative rounded-2xl overflow-hidden group h-[340px] border border-gray-200">
              <img
                src={img}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">
                <h3 className="sd:text-4xl xz:text-2xl font-semibold drop-shadow-md">{c.name}</h3>
                <div>
                  <Link href={`/${c.value}`} className="btn btn-error normal-case">
                    Перейти в каталог
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

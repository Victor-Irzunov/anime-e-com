// /components/sectionMainPage/TrendingProducts.js
import prisma from "@/lib/prisma";
import ProductCardCompact from "@/components/ProductCardCompact";

async function getData() {
  try {
    const data = await prisma.product.findMany({
      where: { discounts: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        titleLink: true,
        description: true,
        price: true,
        discountPercentage: true,
        rating: true,
        stock: true,
        category: true,
        subcategory: true,
        thumbnail: true,
        images: true,
      },
    });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("TrendingProducts getData error:", e);
    return [];
  }
}

export default async function TrendingProducts() {
  const items = await getData();
  if (!items.length) return null;

  return (
    <section className="container mx-auto sd:py-10 xz:py-6">
      <h2 className="text-2xl font-semibold mb-4">Горячие скидки</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCardCompact key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

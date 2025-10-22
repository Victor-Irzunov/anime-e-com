// /components/RecommendedProduct.client.jsx
"use client";

import { useEffect, useState } from "react";
import ProductCardCompact from "@/components/ProductCardCompact";
import { getRecommendedProduct } from "@/http/adminAPI";

export default function RecommendedProduct({ brandId, brandName, excludeId, take = 10, className = "xz:mt-16 sd:mt-20" }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const data = await getRecommendedProduct({ brandId, brandName, excludeId, take });
      if (!ignore) setItems(data);
    })();
    return () => { ignore = true; };
  }, [brandId, brandName, excludeId, take]);

  if (!items.length) return null;

  return (
    <section className={className}>
      <p className="mb-4 text-xl font-medium">Рекомендованные товары</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((p) => (
          <ProductCardCompact key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

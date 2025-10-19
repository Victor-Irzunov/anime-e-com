"use client"
import { useEffect, useState } from "react";
import ProductCardCompact from "./ProductCardCompact";
import { getRecommendedProduct } from "@/http/adminAPI";


export default function RecommendedProduct() {
  const [data, setData] = useState(null)
  useEffect(() => {
    getRecommendedProduct()
      .then(data => {
        if (data) {
          setData(data)
        } else {
          console.log('Ошибка при получении Рекомендованные')
        }
      })
  }, [])

  return (
    <div className="xz:mt-24 sd:mt-36 mb-6">
      <p className="mb-4 text-xl font-medium">
        Рекомендованные товары
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data && data.map((product, idx) => (
          <ProductCardCompact key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

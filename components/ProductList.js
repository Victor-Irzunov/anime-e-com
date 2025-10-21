// /components/ProductList.jsx
import React from "react";
import ProductListSingle from "./ProductListSingle";

function ProductList({ products = [], isListView, categorySlug, subcategorySlug }) {
  return (
    <div className="">
      <div className={`${isListView ? "gap-4 flex flex-wrap" : "gap-1 grid sd:grid-cols-3 xz:grid-cols-2"}`}>
        {products.map((product) => (
          <div key={product.id} className="w-full">
            <ProductListSingle
              product={product}
              isListView={isListView}
              categorySlug={categorySlug}
              subcategorySlug={subcategorySlug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

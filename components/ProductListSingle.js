// /components/ProductListSingle.jsx
import Link from "next/link";

function ProductListSingle({ product = {}, isListView, categorySlug, subcategorySlug }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  // --- images ---
  const rawImages =
    Array.isArray(product.images)
      ? product.images
      : (() => {
        try {
          return JSON.parse(product.images || "[]");
        } catch {
          return [];
        }
      })();

  const imageUrls = (rawImages.length ? rawImages.map(it => it?.url || it?.image || it?.src || "") : [product.thumbnail || ""])
    .filter(Boolean)
    .map((u) => (u.startsWith("http") ? u : `${base}${u}`));

  const thumb =
    product?.thumbnail
      ? product.thumbnail.startsWith("http")
        ? product.thumbnail
        : `${base}${product.thumbnail}`
      : imageUrls[0] || "";

  // --- slugs ---
  const cat =
    product?.categoryValue ??
    categorySlug ??
    product?.categoryRel?.value ??
    product?.category ??
    "";

  const sub =
    product?.subcategoryValue ??
    subcategorySlug ??
    product?.subCategoryRel?.value ??
    product?.subcategory ??
    "";

  const href = `/${encodeURIComponent(cat)}/${encodeURIComponent(sub)}/${encodeURIComponent(product.titleLink || "")}`;

  // --- price / discount ---
  const price = Number(product.price || 0);
  const dp = Number(product.discountPercentage || 0);
  const hasDiscount = dp > 0;
  const oldPrice = hasDiscount ? (price + price * (dp / 100)) : null; // «без учета скидки» — прежняя цена

  // --- rating ---
  const ratingVal = Math.max(0, Math.min(5, Number(product.rating || 0)));
  const halfSteps = Math.round(ratingVal * 2); // 0..10 (по 0.5 шага)

  // --- stock status ---
  const stock = Number(product.stock || 0);
  const inStock = stock > 0;

  // --- article (появится позже; поддержим любые возможные названия) ---
  const sku = product.sku || product.article || product.vendorCode || product.articul || "";

  return (
    <Link
      href={href}
      className={`group bg-white rounded-lg border border-gray-300 p-1 flex gap-4 transition-colors hover:border-primary ${!isListView ? "flex-col" : "flex-col xs:flex-row"
        }`}
      style={{ height: "100%" }}
    >
      {/* IMAGE / CAROUSEL */}
      <div
        className={`rounded-lg overflow-hidden border border-gray-200 bg-gray-50 ${isListView ? "xz:h-42 xz:min-w-42" : ""
          } aspect-square w-full xs:w-auto`}
        style={{ flex: "none" }}
      >
        {imageUrls.length > 1 ? (
          <div className="carousel rounded-box w-full h-full">
            {imageUrls.map((src, idx) => (
              <div key={`${src}-${idx}`} className="carousel-item w-full">
                <img
                  src={src}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        ) : thumb ? (
          <img
            src={thumb}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-between sd:p-3 xz:p-2">
        {/* Title */}
        <h3
          className={`font-semibold text-base leading-snug ${isListView ? "" : "xz:text-xs sd:text-base"
            }`}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={product.title}
        >
          {product.title}
        </h3>

        {product.article ? (
          <p className="font-light text-[10px] text-gray-400 mt-1">Артикль: {product.article}</p>
        ) : null}

        {/* Price row */}
        <div className="pt-1 flex items-center gap-3">
          <strong className={`${isListView ? "text-lg" : "text-base"} font-bold text-gray-800`}>
            {price.toFixed(2)} руб
          </strong>

          {hasDiscount ? (
            <>
              <span className={`font-extralight text-gray-500 line-through ${isListView ? "block" : "xz:hidden sd:block"}`}>
                {oldPrice.toFixed(2)} руб
              </span>
              <span className="text-red-500 text-xs font-semibold">-{dp}%</span>
            </>
          ) : null}
        </div>

        {/* Rating + stock + article */}
        <div className="mt-2 flex sd:flex-row xz:flex-col xz:space-y-1 sd:space-y-0 sd:items-center xz:items-start justify-between">
          

          {/* stock */}
          <div className="flex items-center gap-2 sd:pl-0 xz:pl-0.5">
            <span className={`text-[10px] ${inStock ? "text-emerald-600" : "text-gray-500"}`}>
              {inStock ? "В наличии" : "Под заказ"}
            </span>
          
          </div>
        </div>

        {/* Description */}
        <p
          className={`py-2 text-gray-500 sd:text-xs xz:text-[10px]`}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={product.description}
        >
          {product.description}
        </p>

        {/* CTA */}
        <span className="mt-auto pt-1">
          <span className={`inline-flex items-center gap-1 text-secondary sd:text-sm xz:text-[10px] xy:text-xs`}>
            Перейти к просмотру
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
            </svg>
          </span>
        </span>
      </div>
    </Link>
  );
}

export default ProductListSingle;

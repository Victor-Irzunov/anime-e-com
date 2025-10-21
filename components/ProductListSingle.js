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
      className={`group bg-white rounded-lg border border-gray-300 p-3 flex gap-4 transition-colors hover:border-primary ${!isListView ? "flex-col" : "flex-col xs:flex-row"
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
      <div className="flex-1 flex flex-col justify-between">
        {/* Title */}
        <h3
          className={`font-semibold text-base leading-snug ${isListView ? "" : "xz:text-sm sd:text-base"
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
          <strong className={`${isListView ? "text-lg" : "text-base"} font-medium text-gray-800`}>
            {price.toFixed(2)} руб
          </strong>

          {hasDiscount ? (
            <>
              <span className={`font-light text-gray-500 line-through ${isListView ? "block" : "xz:hidden sd:block"}`}>
                {oldPrice.toFixed(2)} руб
              </span>
              <span className="text-red-500 text-xs font-semibold">-{dp}%</span>
            </>
          ) : null}
        </div>

        {/* Rating + stock + article */}
        <div className="mt-2 flex items-center justify-between">
          {/* rating half (xs) */}
          <div className="flex items-center gap-2">
            <div className="rating rating-xs rating-half">
              <input type="radio" name={`rating-${product.id}`} className="rating-hidden" aria-label="no rating" />
              {Array.from({ length: 10 }).map((_, i) => {
                const half = (i % 2) === 0 ? "mask-half-1" : "mask-half-2";
                const label =
                  i === 0 ? "0.5 star" :
                    i === 1 ? "1 star" :
                      i === 2 ? "1.5 star" :
                        i === 3 ? "2 star" :
                          i === 4 ? "2.5 star" :
                            i === 5 ? "3 star" :
                              i === 6 ? "3.5 star" :
                                i === 7 ? "4 star" :
                                  i === 8 ? "4.5 star" : "5 star";
                const idx = i + 1;
                return (
                  <input
                    key={i}
                    type="radio"
                    name={`rating-${product.id}`}
                    className={`mask mask-star-2 ${half} ${idx <= halfSteps ? "bg-orange-500" : ""}`}
                    aria-label={label}
                    readOnly
                    defaultChecked={idx === (halfSteps || 10)} // если 0 — пусть покажет 5 как дефолт? лучше 0: не отмечать
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-gray-500">{ratingVal.toFixed(1)}</span>
          </div>

          {/* stock */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] ${inStock ? "text-emerald-600" : "text-gray-500"}`}>
              {inStock ? "В наличии" : "Под заказ"}
            </span>
            {/* Артикль — если появится */}
            {sku ? (
              <span className="font-light text-[10px] text-gray-400">Артикль: {sku}</span>
            ) : null}
          </div>
        </div>

        {/* Description */}
        <p
          className={`py-2 text-gray-500 text-xs`}
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
          <span className={`inline-flex items-center gap-1 text-primary ${isListView ? "block" : "sd:block xz:hidden"}`}>
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

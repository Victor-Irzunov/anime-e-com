import Link from "next/link";

/** Нормализация thumbnail из разных форматов БД */
function normalizeThumb(thumbnail) {
  if (!thumbnail) return "";
  if (typeof thumbnail === "string") {
    try {
      const parsed = JSON.parse(thumbnail);
      if (Array.isArray(parsed) && parsed.length) {
        const v = parsed[0]?.image ?? parsed[0];
        return typeof v === "string" ? v : "";
      }
      if (parsed && typeof parsed === "object") {
        return parsed.image || "";
      }
    } catch {
      return thumbnail; // не JSON — уже путь/URL
    }
  }
  if (Array.isArray(thumbnail) && thumbnail.length) {
    const v = thumbnail[0]?.image ?? thumbnail[0];
    return typeof v === "string" ? v : "";
  }
  if (typeof thumbnail === "object" && thumbnail?.image) return thumbnail.image;
  return "";
}

function withBase(url) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith("/")
    ? url
    : url.startsWith("uploads/")
    ? `/${url}`
    : `/uploads/${url}`;
  return `${base}${path}`;
}

/** Подсчёт процента паддинга для aspect-ratio вида "4/3", "1/1" и т.п. */
function ratioToPadding(ratio = "4/3") {
  const [w, h] = ratio.split("/").map(Number);
  if (!w || !h) return "75%"; // дефолт 4:3
  return `${(h / w) * 100}%`;
}

/** Транслитерация + slug на латинице (на случай отсутствия value/slug из БД) */
function toSlug(input = "") {
  const s = String(input).toLowerCase();
  const map = {
    а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"yo", ж:"zh", з:"z", и:"i", й:"y",
    к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u", ф:"f",
    х:"h", ц:"c", ч:"ch", ш:"sh", щ:"shch", ы:"y", э:"e", ю:"yu", я:"ya",
    ь:"", ъ:"", ї:"i", і:"i", ґ:"g", є:"e",
  };
  const translit = s.replace(/[а-яёіїґє]/g, ch => map[ch] ?? ch);
  return translit
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export default function ProductCardCompact({
  product = {},
  /** Задать нужное соотношение сторон для всех карточек (по умолчанию 4/3) */
  imageRatio = "4/3",
}) {
  const {
    title,
    thumbnail,
    price,

    // строки в БД (на случай отсутствия связей)
    category,
    subcategory,

    // SEO-ссылка товара
    titleLink,

    // если API вернул value-слуги из связей (см. /api/product GET include)
    categoryValue,
    subcategoryValue,

    // возможно, бэкенд присылает сами связи
    categoryRel,
    subCategoryRel,
  } = product;

  const rawThumb = normalizeThumb(thumbnail);
  const imgSrc = withBase(rawThumb);

  // предпочитаем готовые слуги из связей, иначе делаем slug из русских названий
  const catSlug =
    categoryValue ||
    categoryRel?.value ||
    (category ? toSlug(category) : "catalog");
  const subSlug =
    subcategoryValue ||
    subCategoryRel?.value ||
    (subcategory ? toSlug(subcategory) : "all");
  const productSlug = titleLink || toSlug(title || "product");

  const href = `/${encodeURIComponent(catSlug)}/${encodeURIComponent(
    subSlug
  )}/${encodeURIComponent(productSlug)}`;

  /**
   * ВАЖНО ДЛЯ ЕДИНОЙ ВЫСОТЫ:
   * - Карточка: flex-col + h-full, чтобы растягиваться в гриде
   * - Изображение: фиксированное соотношение сторон через "padding-bottom"
   *   и абсолютная картинка с object-cover (всегда заполняет весь бокс)
   * - Текст: ограничиваем высоту заголовка двумя строками
   */
  return (
    <Link
      href={href}
      prefetch={false}
      className="group rounded-lg bg-white border border-gray-300 hover:border-primary hover:shadow-sm transition flex flex-col h-full p-3"
      aria-label={title || "Товар"}
      title={title}
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Изображение с единым соотношением сторон */}
      <div
        className="relative w-full overflow-hidden rounded-md bg-gray-100"
        style={{ paddingBottom: ratioToPadding(imageRatio) }} // например 4/3 => 75%
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title || ""}
            itemProp="image"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </div>

      {/* Цена (одна строка) */}
      <strong
        className="mt-3 block font-semibold text-gray-900 text-lg leading-snug"
        itemProp="offers"
        itemScope
        itemType="https://schema.org/Offer"
      >
        <span itemProp="price" className="sd:text-base xz:text-sm">{Number(price || 0).toFixed(2)}</span>{" "}
        <span itemProp="priceCurrency" className="sd:text-base xz:text-xs" content="BYN">руб.</span>
        <meta itemProp="availability" content="https://schema.org/InStock" />
      </strong>

      {/* Заголовок: фиксируем высоту в 2 строки */}
      <h3
        className="mt-1 text-gray-500 font-normal leading-tight sd:text-sm xz:text-xs"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "2.6em", // ≈ 2 строки
        }}
        itemProp="name"
      >
        {title}
      </h3>

      <meta itemProp="category" content={catSlug} />
    </Link>
  );
}

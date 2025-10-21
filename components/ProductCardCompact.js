// components/ProductCardCompact.js
import Link from "next/link";

function normalizeThumb(thumbnail) {
  if (!thumbnail) return "";
  // строка -> пробуем как JSON
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
      // не JSON — значит это уже путь/URL
      return thumbnail;
    }
  }
  // массив
  if (Array.isArray(thumbnail) && thumbnail.length) {
    const v = thumbnail[0]?.image ?? thumbnail[0];
    return typeof v === "string" ? v : "";
  }
  // объект
  if (typeof thumbnail === "object" && thumbnail?.image) {
    return thumbnail.image;
  }
  return "";
}

function withBase(url) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (!url) return "";
  // абсолютный URL — отдаем как есть
  if (/^https?:\/\//i.test(url)) return url;
  // если пришло "uploads/xxx.webp" — добавим слэш/папку
  const path = url.startsWith("/")
    ? url
    : url.startsWith("uploads/")
    ? `/${url}`
    : `/uploads/${url}`;
  return `${base}${path}`;
}

export default function ProductCardCompact({ product = {} }) {
  const { title, thumbnail, category, titleLink, subcategory, price } = product;

  const rawThumb = normalizeThumb(thumbnail);
  const imgSrc = withBase(rawThumb);

  const href = `/${encodeURIComponent(category || "")}/${encodeURIComponent(
    subcategory || ""
  )}/${encodeURIComponent(titleLink || "")}`;

  return (
    <Link
      href={href}
      className="group hover:shadow-sm rounded-lg bg-white border border-gray-300 hover:border-primary flex flex-col gap-2 py-3 px-3"
    >
      <div className="group-hover:scale-105 transition-transform">
        {imgSrc ? (
          <img
            src={imgSrc}
            width={200}
            height={200}
            alt={title || ""}
            className="mx-auto object-contain"
          />
        ) : (
          <div className="w-full h-[200px] bg-gray-100 rounded" />
        )}
      </div>

      <strong className="block font-medium text-gray-900">
        {Number(price || 0).toFixed(2)} руб.
      </strong>

      <p className="leading-tight text-gray-400 font-normal">{title}</p>
    </Link>
  );
}

// /components/ProductCategoryCard.jsx
import Link from "next/link";
import { transliterate } from "@/transliterate/transliterate";

function slugify(val) {
  return transliterate(val || "").replace(/\s+/g, "-").toLowerCase();
}

function ProductCategoryCard({ data, size }) {
  const { title, thumbnail, category, subcategory, description, titleLink } = data;

  const slugCat = data.categoryValue || slugify(category);
  const slugSub = data.subcategoryValue || slugify(subcategory);

  const imgSrc =
    typeof thumbnail === "string"
      ? (thumbnail.startsWith("http") ? thumbnail : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${thumbnail}`)
      : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${thumbnail?.url || ""}`;

  return (
    <Link
      href={`/${slugCat}/${slugSub}/${titleLink}`}
      className="relative flex-1 block group rounded-lg overflow-hidden border border-gray-300"
    >
      <img
        alt={title}
        src={imgSrc}
        className="object-cover w-full aspect-video group-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
        {size === "xl" ? (
          <>
            <h3 className="text-3xl font-bold text-white">{title}</h3>
            <p className="max-w-lg py-3 text-white">{description}</p>
            <button className="btn btn-secondary text-lg capitalize">Купить сейчас</button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
            <button className="btn btn-sm btn-secondary capitalize">Купить сейчас</button>
          </>
        )}
      </div>
    </Link>
  );
}

export default ProductCategoryCard;

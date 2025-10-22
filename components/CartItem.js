import Link from "next/link";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

function thumbUrl(thumbnail) {
  if (!thumbnail) return "/svg/placeholder.svg";
  if (Array.isArray(thumbnail)) return thumbUrl(thumbnail[0]);
  if (typeof thumbnail === "object") return thumbUrl(thumbnail.url || thumbnail.image);

  if (typeof thumbnail === "string") {
    try {
      const p = JSON.parse(thumbnail);
      return thumbUrl(p);
    } catch {
      if (thumbnail.startsWith("http") || thumbnail.startsWith("data:")) return thumbnail;
      if (thumbnail.startsWith("/")) return `${BASE}${thumbnail}`;
      return `${BASE}/uploads/${thumbnail}`;
    }
  }
  return "/svg/placeholder.svg";
}

function CartItem({ product, onDelete, onDecrement, onIncrement }) {
  if (!product) return null;

  const handleDelete = () => onDelete(product.id);
  const handleDecrement = () => onDecrement(product.id);
  const handleIncrement = () => onIncrement(product.id);

  const src = thumbUrl(product?.thumbnail);

  return (
    <div className="flex flex-col xs:flex-row gap-6 border-b pb-3">
      <div className="w-full xs:w-28 h-28 rounded-lg overflow-hidden border border-gray-300">
        <img src={src} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-1 mt-4 xs:mt-0">
        <h2 className="text-lg">
          <Link href={`${BASE}/${product.category}/${product.subcategory}/${product.titleLink}`}>
            {product.title}
          </Link>
        </h2>
        <div className="text-sm text-gray-400">
          <p>Описание: {product.description}</p>
          <p>Бренд: {product.brand}</p>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            className="btn btn-xs text-red-500 uppercase btn-ghost font-light"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end mt-4 xs:mt-0">
        <strong className="text-2xl font-medium text-gray-800">
          {(product.price * product.quantity).toFixed(2)} руб
        </strong>
        <span className="font-medium text-gray-500 line-through">
          {(
            (product.price ? (product.price / 100) * product.discountPercentage + product.price : 0) *
            product.quantity
          ).toFixed(2)}{" "}
          руб
        </span>
        <span className="text-green-500 text-sm font-semibold">
          {product.discountPercentage}%
        </span>

        <div className="join pt-5">
          <button className="join-item btn btn-sm px-2 border border-gray-300" onClick={handleDecrement}>
            <RiSubtractFill fontSize={20} />
          </button>
          <button className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300">
            {product.quantity}
          </button>
          <button className="join-item btn btn-sm px-2 border border-gray-300" onClick={handleIncrement}>
            <RiAddFill fontSize={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;

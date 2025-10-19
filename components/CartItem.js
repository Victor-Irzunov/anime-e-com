import Link from "next/link";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";

function CartItem({ product, onDelete, onDecrement, onIncrement }) {
    if (!product) {
        return null;
    }
    const handleDelete = () => {
        onDelete(product.id);
    };
    const handleDecrement = () => {
        onDecrement(product.id);
    };
    const handleIncrement = () => {
        onIncrement(product.id);
    };

    return (
        <div className="flex flex-col xs:flex-row gap-6 border-b pb-3">
            <div className="w-full xs:w-[7rem] h-[7rem] rounded-lg overflow-hidden border border-gray-300">
                <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${JSON.parse(product.thumbnail)[0].image}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1 mt-4 xs:mt-0">
                <h2 className="text-lg">
                    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/${product.category}/${product.subcategory}/${product.titleLink}`}>
                        {product.title}
                    </Link>
                </h2>
                <div className="text-sm text-gray-400">
                    <p>Описание: {product.description}</p>
                    <p>Бренд: {product.brand}</p>
                </div>
                <div className="flex items-center gap-3 mt-5">
                    <button className="btn btn-xs text-red-500 uppercase btn-ghost font-light" onClick={handleDelete}>
                        Удалить
                    </button>
                    {/* <button className="btn btn-sm btn-outline capitalize btn-primary">Купить потом</button> */}
                </div>
            </div>


            <div className="flex flex-col items-end mt-4 xs:mt-0">
                <strong className="text-2xl font-medium text-gray-800">
                    {(product.price * product.quantity).toFixed(2)} руб
                </strong>
                <span className="font-medium text-gray-500 line-through">
                    {(product.price ? ((product.price / 100 * product.discountPercentage) + product.price) * product.quantity : 0).toFixed(2)} руб
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

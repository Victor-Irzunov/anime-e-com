import Link from "next/link"

function ProductCardCompact({ product }) {
    const { title, thumbnail, category, titleLink, subcategory, discountPercentage, price } = product

    const img = JSON.parse(thumbnail)[0].image

    return (
        <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${category}/${subcategory}/${titleLink}`}
            className="group hover:shadow-sm rounded-lg bg-white border border-gray-300 flex flex-col gap-2 py-3 px-3"
        >
            <div className="group-hover:scale-105 transition-transform">
                <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img}`} width={200} height={200} alt={title} className="mx-auto" />
            </div>
            <strong className="block font-medium text-gray-900">
                {price} руб.
            </strong>
            <p className="leading-tight text-gray-400 font-normal">
                {title}
            </p>
        </Link>
    )
}

export default ProductCardCompact

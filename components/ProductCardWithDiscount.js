import Image from "next/image"
import Link from "next/link"
import React from "react"

function ProductCardWithDiscount({ product }) {
    const { title, thumbnail, category, titleLink, subcategory, discountPercentage } = product

    const img = JSON.parse(thumbnail)[0].image
    return (
        <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${category}/${subcategory}/${titleLink}`}
            className="group h-full w-full flex flex-col gap-2  py-3 px-3 items-center"
        >
            <div className="group-hover:scale-105 transition-transform min-h-[60%]">
                <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img}`}
                    width={140} height={140}
                    alt={title} />
            </div>
            <strong className="block font-normal text-gray-900 sd:text-sm xz:text-base">
                {title}
            </strong>
            <span className="badge badge-success text-green-600 bg-opacity-30">
                - {discountPercentage}%
            </span>
        </Link>
    )
}

export default ProductCardWithDiscount

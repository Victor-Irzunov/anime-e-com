import Link from "next/link"

function ProductCategoryCard({ data, size }) {
    const { title, thumbnail, category, description, titleLink, subcategory} = data

    const img = JSON.parse(thumbnail)[0].image
    return (
        <Link
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${category}/${subcategory}/${titleLink}`}
            className="relative flex-1 block group rounded-lg overflow-hidden border border-gray-300">
            <img
                alt={title}
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img}`}
                className="object-cover w-full aspect-video group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                {size === "xl" ? (
                    <>
                        <h3 className="text-3xl font-bold text-white">{title}</h3>
                        <p className="max-w-lg py-3 text-white">
                           {description}
                        </p>
                        <button className="btn btn-secondary text-lg capitalize">
                            Купить сейчас
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-medium text-white mb-2">{name}</h3>
                        <button className="btn btn-sm btn-secondary capitalize">
                            Купить сейчас
                        </button>
                    </>
                )}
            </div>
        </Link>
    )
}

export default ProductCategoryCard

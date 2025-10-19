import ImgProductDetails from "./ImgProductDetails"

function ProductDetailsOverview({ product }) {
    const info = JSON.parse(product.info)

    return (
        <div>
            <ImgProductDetails product={product} />
            <div className="bg-white p-6 pt-4 rounded-lg border border-gray-300 gap-6 mt-6">
                <h3 className="mb-8 text-lg">Характеристики</h3>
                <div className="flow-root">
                    <dl className="-my-3 divide-y divide-gray-100">

                        {info.map((specification, index) => (
                            <div key={index} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-medium text-gray-900">{specification.property}</dt>
                                <dd className="text-gray-700 sm:col-span-2">{specification.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            <article className='mt-20'>
                <p className='sd:text-base xz:text-sm'>
                    {
                        product.content ?
                            product.content
                            :
                            null
                    }
                </p>

            </article>
        </div>
    )
}

export default ProductDetailsOverview

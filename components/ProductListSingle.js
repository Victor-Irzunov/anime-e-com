import Link from "next/link";


function ProductListSingle({ product, isListView }) {

  const img = JSON.parse(product.thumbnail)[0].image
  const id = product.id
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/${product.category}/${product.subcategory}/${product.titleLink}`}
      key={product.id}
      className={`group bg-white rounded-lg border border-gray-300 p-3 flex gap-6 ${!isListView ? 'flex-col' : 'flex-col xs:flex-row'}`}
      style={{ height: '100%' }}
    >
      <div className={`aspect-square bg-gray-100 rounded-lg overflow-hidden ${isListView ? 'xz:h-[10.5rem] xz:min-w-[10.5rem]' : ''}`} style={{ flex: 'none' }}>
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className={`font-semibold ${isListView ? 'text-base' : 'xz:text-sm sd:text-base'}`}>
            {product.title}
          </h2>
          <div className="pt-1 flex items-center gap-3">
            <strong className={`${isListView ? 'text-lg' : 'text-base'} font-medium text-gray-800`}>{product.price.toFixed(2)} руб</strong>
            <span className={`font-light text-gray-500 line-through ${isListView ? 'block' : 'xz:hidden sd:block'}`}>{(product.price + 59).toFixed(2)} руб</span>
            <span className={`text-green-500 text-sm font-semibold ${isListView ? 'block' : 'xz:hidden sd:block'}`}>{product.discountPercentage}%</span>
          </div>
          <div className={`flex items-center gap-4 ${isListView ? 'mt-0' : 'sd:mt-0 xz:mt-2'}`}>
            <div className={`rating  disabled ${isListView ? 'rating-sm' : 'sd:rating-sm xz:rating-xs'}`}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <input
                  key={rating}
                  type="radio"
                  className={`mask mask-star-2 ${Math.round(product.rating) >= rating ? "bg-orange-400" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className={`text-green-500 ${isListView ? 'block' : 'xz:hidden sd:block'}`}>Быстрая доставка</span>
          </div>
          <p className={`py-2 text-gray-500 ${isListView ? 'text-base' : 'xz:text-xs sd:text-sm'}`}>{product.description}</p>
        </div>
        <span className="mt-auto">
          <p className={`link link-primary no-underline ${isListView ? 'block' : 'sd:block xz:hidden'}`}>Перейти к просмотру</p>
        </span>
      </div>
    </Link >
  );
}

export default ProductListSingle;

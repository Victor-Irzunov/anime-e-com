// /components/ProductDetailsOverview.js
import ImgProductDetails from "./ImgProductDetails";

function ProductDetailsOverview({ product }) {
  const info = Array.isArray(product.info)
    ? product.info
    : (() => {
        try { return JSON.parse(product.info || "[]"); } catch { return []; }
      })();

  return (
    <div>


      <div className="bg-white p-6 pt-4 rounded-lg border border-gray-300 gap-6 mt-6">
        <h3 className="mb-8 text-lg">Характеристики</h3>
        <div className="flow-root">
          <dl className="-my-3 divide-y divide-gray-100">
            {info.map((spec, i) => (
              <div key={i} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">{spec.property}</dt>
                <dd className="text-gray-700 sm:col-span-2">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {product.content ? (
        <article className="mt-20 prose max-w-none" dangerouslySetInnerHTML={{ __html: product.content }} />
      ) : null}
    </div>
  );
}

export default ProductDetailsOverview;

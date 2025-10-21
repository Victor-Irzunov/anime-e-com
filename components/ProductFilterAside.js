// /components/ProductFilterAside.jsx
import { RiArrowDownSLine } from "react-icons/ri";

function ProductFilterAside({
  products,
  onBrandFilterChange,
  onPriceChange,
  onResetPriceFilter,
  selectedBrands,
  priceRange,
  onResetBrandFilter,
}) {
  // Нормализуем вход: может прийти массив, а может {items: []}
  const list = Array.isArray(products) ? products : products?.items || [];

  const handleBrandCheckboxChange = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    onBrandFilterChange(updated);
  };

  const handlePriceChange = (type, value) => onPriceChange(type, value);

  return (
    <div className="w-[18rem]">
      <p className="font-medium text-gray-700">Фильтр</p>

      <div className="mt-1 flex flex-col gap-4">
        <details className="overflow-hidden rounded-lg border border-gray-300 bg-white" open>
          <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900">
            <span className="text-sm font-medium">Бренды</span>
            <RiArrowDownSLine fontSize={18} />
          </summary>

          <div className="border-t border-gray-200">
            <header className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">Бренд</span>
              <button
                type="button"
                className="text-sm text-gray-900 underline underline-offset-4"
                onClick={onResetBrandFilter}
              >
                Сброс
              </button>
            </header>

            <div className="border-t border-gray-200 p-4 flex flex-col gap-2">
              {list.length > 0 &&
                [...new Set(list.map((p) => p.brand).filter(Boolean))].map((brand, idx) => (
                  <label key={`${brand}-${idx}`} htmlFor={`brand_${idx}`} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`brand_${idx}`}
                      className="checkbox checkbox-sm checkbox-primary border-gray-400"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandCheckboxChange(brand)}
                    />
                    <span className="text-sm font-medium text-gray-700">{brand}</span>
                  </label>
                ))}
            </div>
          </div>
        </details>

        <details className="overflow-hidden rounded-lg border border-gray-300 bg-white" open>
          <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900">
            <span className="text-sm font-medium">Цена</span>
            <RiArrowDownSLine fontSize={18} />
          </summary>

          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between gap-4 mb-5">
              <label htmlFor="FilterPriceFrom" className="flex items-center gap-2">
                <input
                  type="number"
                  id="FilterPriceFrom"
                  placeholder="от"
                  className="input input-bordered rounded-lg input-sm w-full"
                  value={priceRange.from}
                  onChange={(e) => handlePriceChange("from", e.target.value)}
                />
              </label>

              <label htmlFor="FilterPriceTo" className="flex items-center gap-2">
                <input
                  type="number"
                  id="FilterPriceTo"
                  placeholder="до"
                  className="input input-bordered rounded-lg input-sm w-full"
                  value={priceRange.to}
                  onChange={(e) => handlePriceChange("to", e.target.value)}
                />
                <span className="text-sm text-gray-600">руб</span>
              </label>
            </div>

            <button type="button" className="btn btn-ghost btn-sm" onClick={onResetPriceFilter}>
              Сбросить цену
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}

export default ProductFilterAside;

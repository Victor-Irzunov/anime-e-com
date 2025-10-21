// /app/[category]/ClientList.jsx
"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import ProductFilterAside from "@/components/ProductFilterAside";
import ProductList from "@/components/ProductList";
import { RiLayoutGridLine, RiListCheck2, RiFilter2Line } from "react-icons/ri";

export default function ClientList({ category, title = "" }) {
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [isListView, setIsListView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setProducts(null);
    setFilteredProducts(null);
    setSelectedBrands([]);
    setPriceRange({ from: "", to: "" });
    setSortOption("");
    setCurrentPage(1);

    (async () => {
      try {
        const r = await fetch(`/api/public/products?category=${encodeURIComponent(category)}`, { cache: "no-store" });
        const j = await r.json();
        if (j?.ok) {
          setProducts(j.items || []);
          setFilteredProducts(j.items || []);
          setTotalItems((j.items || []).length);
        }
      } catch {
        setProducts([]);
        setFilteredProducts([]);
        setTotalItems(0);
      }
    })();
  }, [category]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, priceRange, sortOption, products, currentPage]);

  const handleBrandFilterChange = (selected) => setSelectedBrands(selected);
  const handleSortChange = (e) => setSortOption(e.target.value);
  const handlePriceChange = (type, value) => setPriceRange((prev) => ({ ...prev, [type]: value }));
  const handleResetPriceFilter = () => setPriceRange({ from: "", to: "" });
  const handlePageChange = (n) => setCurrentPage(n);

  const applyFilters = () => {
    if (!products) return;

    let list = [...products];

    if (priceRange.from !== "") list = list.filter((p) => p.price >= parseFloat(priceRange.from));
    if (priceRange.to !== "") list = list.filter((p) => p.price <= parseFloat(priceRange.to));

    if (selectedBrands.length > 0) list = list.filter((p) => selectedBrands.includes(p.brand));

    if (sortOption === "PriceLowToHigh") list.sort((a, b) => a.price - b.price);
    if (sortOption === "PriceHighToLow") list.sort((a, b) => b.price - a.price);
    if (sortOption === "Rating") list.sort((a, b) => b.rating - a.rating);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setFilteredProducts(list.slice(start, end));
    setTotalItems(list.length);
  };

  return (
    <div className="container mx-auto pt-2 pb-10">

      {products ? (
        <div className="px-2 py-4 flex">
          <div className="sd:block xz:hidden">
            <ProductFilterAside
              products={products}
              onBrandFilterChange={handleBrandFilterChange}
              onPriceChange={handlePriceChange}
              onResetPriceFilter={handleResetPriceFilter}
              onResetBrandFilter={() => setSelectedBrands([])}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
            />
          </div>

          <div className="sd:pl-4 xz:pl-0 flex-1">
            <div className="">
              <p>{totalItems} товаров</p>
            </div>

            <div className="pt-[1.7rem] pb-2 flex flex-col items-center">
              <div className="flex justify-start w-full sd:hidden xz:block mb-4">
                <div className="drawer z-40">
                  <input id="drawer-cat" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label
                      htmlFor="drawer-cat"
                      className="btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item"
                    >
                      <RiFilter2Line fontSize={20} />
                      <span className="">Фильтр</span>
                    </label>
                  </div>
                  <div className="drawer-side z-50">
                    <label htmlFor="drawer-cat" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="menu px-4 py-14 w-80 min-h-full bg-base-200 text-base-content">
                      <ProductFilterAside
                        hidden
                        products={products}
                        onBrandFilterChange={handleBrandFilterChange}
                        onPriceChange={handlePriceChange}
                        onResetPriceFilter={handleResetPriceFilter}
                        onResetBrandFilter={() => setSelectedBrands([])}
                        selectedBrands={selectedBrands}
                        priceRange={priceRange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 sd:w-full">
                <div className="">
                  <select
                    id="SortBy"
                    className="select min-h-0 h-10 border-gray-300 rounded-lg"
                    onChange={handleSortChange}
                    value={sortOption}
                  >
                    <option value="">Сортировать</option>
                    <option value="PriceLowToHigh">По увеличении цены</option>
                    <option value="PriceHighToLow">По уменьшении цены</option>
                    <option value="Rating">Рейтингу</option>
                  </select>
                </div>
                <div className="join space-x-0.5">
                  <button
                    className={`btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item ${
                      isListView ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setIsListView(true)}
                  >
                    <RiListCheck2 fontSize={20} />
                  </button>
                  <button
                    className={`btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item ${
                      !isListView ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setIsListView(false)}
                  >
                    <RiLayoutGridLine fontSize={20} />
                  </button>
                </div>
              </div>
            </div>

            <ProductList
              products={filteredProducts || []}
              isListView={isListView}
              categorySlug={category}
            />

            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="p-12 flex min-h-88">
          <span className="m-auto loading loading-ring loading-lg"></span>
        </div>
      )}
    </div>
  );
}

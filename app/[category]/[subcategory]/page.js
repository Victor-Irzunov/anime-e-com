"use client"
import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import ProductFilterAside from "@/components/ProductFilterAside";
import ProductList from "@/components/ProductList";
import { RiLayoutGridLine, RiListCheck2, RiFilter2Line } from "react-icons/ri";
import { getAllProductsOneSubCategory } from "@/http/adminAPI";
import { dataCategory } from "@/lib/const/categoryData";
import RecommendedProduct from "@/components/RecommendedProduct";

export default function List({ params: { subcategory } }) {
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [isListView, setIsListView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Количество товаров на странице
  const [totalItems, setTotalItems] = useState(0); // Общее количество товаров для пагинации
  const [h1, setH1] = useState('')
  const [content, setContent] = useState(null)

  useEffect(() => {

    getAllProductsOneSubCategory(subcategory)
      .then(data => {
        if (data) {
          setProducts(data);
          setFilteredProducts(data);
          setTotalItems(data.length); // Устанавливаем общее количество товаров
        }
      })

    const category = dataCategory.find(cat => cat.children.some(child => child.link.split('/').filter(Boolean)[1] === subcategory));
    if (category) {
      const selectedChild = category.children.find(child => child.link.split('/').filter(Boolean)[1] === subcategory);
      if (selectedChild) {
        setH1(selectedChild.name);
        setContent(selectedChild.content);
      }
    }


  }, [subcategory])

  useEffect(() => {
    applyFilters();
  }, [selectedBrands, priceRange, sortOption, products, currentPage]);


  const handleBrandFilterChange = (selectedBrands) => {
    setSelectedBrands(selectedBrands);
  };

  const handleSortChange = (event) => {
    const selectedSortOption = event.target.value;
    setSortOption(selectedSortOption);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prevRange) => ({ ...prevRange, [type]: value }));
  };

  const handleResetPriceFilter = () => {
    setPriceRange({ from: "", to: "" });
  };

  const applyFilters = () => {
    if (!products) {
      return;
    }
    let priceFilteredProducts = [...products];
    if (priceRange.from !== "") {
      priceFilteredProducts = priceFilteredProducts.filter((product) => product.price >= parseFloat(priceRange.from));
    }
    if (priceRange.to !== "") {
      priceFilteredProducts = priceFilteredProducts.filter((product) => product.price <= parseFloat(priceRange.to));
    }
    const brandFilteredProducts =
      selectedBrands.length > 0 ? priceFilteredProducts.filter((product) => selectedBrands.includes(product.brand)) : priceFilteredProducts;
    let sortedProducts = [...brandFilteredProducts];
    if (sortOption === "PriceLowToHigh") {
      sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "PriceHighToLow") {
      sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Rating") {
      sortedProducts = sortedProducts.sort((a, b) => b.rating - a.rating);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredProducts(sortedProducts.slice(startIndex, endIndex));
    setTotalItems(sortedProducts.length); // Обновляем общее количество товаров для пагинации
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto pt-2 pb-10">
      <Breadcrumbs />
      <div className="my-5">

        <h1 className="text-4xl">
          {h1}
        </h1>
      </div>
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
                  <input id="my-drawer4" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label htmlFor="my-drawer4" className="btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item">
                      <RiFilter2Line fontSize={20} />
                      <span className="">Фильтр</span>
                    </label>
                  </div>
                  <div className="drawer-side z-50">
                    <label htmlFor="my-drawer4" aria-label="close sidebar" className="drawer-overlay"></label>
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
                <div className="join">
                  <button
                    className={`btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item ${isListView ? 'bg-gray-200' : ''}`}
                    onClick={() => setIsListView(true)}
                  >
                    <RiListCheck2 fontSize={20} />
                  </button>
                  <button
                    className={`btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item ${!isListView ? 'bg-gray-200' : ''}`}
                    onClick={() => setIsListView(false)}
                  >
                    <RiLayoutGridLine fontSize={20} />
                  </button>
                </div>
              </div>
            </div>

            <ProductList products={filteredProducts} isListView={isListView} />

            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="p-12 flex min-h-[22rem]">
          <span className="m-auto loading loading-ring loading-lg"></span>
        </div>
      )}

      {
        content ? content : null
      }

      <RecommendedProduct />
    </div>
  );
}

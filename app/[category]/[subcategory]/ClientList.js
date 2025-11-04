// /app/[category]/[subcategory]/ClientList.jsx — ПОЛНОСТЬЮ
"use client";

import React, { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import ProductFilterAside from "@/components/ProductFilterAside";
import ProductList from "@/components/ProductList";
import { RiLayoutGridLine, RiListCheck2, RiFilter2Line } from "react-icons/ri";
import { getAllProductsOneSubCategory } from "@/http/adminAPI";
import Image from "next/image";

/** Утилита нормализации пути к картинке */
function normalizeSrc(raw) {
  if (!raw) return "/images/banner/banner.webp";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/") || raw.startsWith("uploads/")) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
  if (raw.startsWith("/images/") || raw.startsWith("images/")) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
  // в БД только имя файла
  return `/uploads/${raw}`;
}

export default function ClientList({ category, subcategory }) {
  // Список товаров
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Фильтры/сортировка/вид
  const [sortOption, setSortOption] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [isListView, setIsListView] = useState(false);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalItems, setTotalItems] = useState(0);

  // Заголовок/контент/картинка подкатегории
  const [h1, setH1] = useState("");
  const [content, setContent] = useState(null);
  const [heroImage, setHeroImage] = useState("");

  // Загрузка данных при смене подкатегории/категории
  useEffect(() => {
    // сброс состояний
    setProducts([]);
    setFilteredProducts([]);
    setLoaded(false);

    setSelectedBrands([]);
    setPriceRange({ from: "", to: "" });
    setSortOption("");
    setIsListView(false);

    setCurrentPage(1);
    setTotalItems(0);

    setH1("");
    setContent(null);
    setHeroImage("");

    // 1) Товары
    getAllProductsOneSubCategory(subcategory, category).then((arr) => {
      const list = Array.isArray(arr) ? arr : [];
      setProducts(list);
      setFilteredProducts(list.slice(0, itemsPerPage));
      setTotalItems(list.length);
      setLoaded(true);
    });

    // 2) H1/контент/картинка подкатегории — ИСПРАВЛЕНО: точный запрос по value+category
    (async () => {
      try {
        const r = await fetch(
          `/api/admin/subcategories?value=${encodeURIComponent(subcategory)}&category=${encodeURIComponent(category)}`,
          { cache: "no-store" }
        );
        const j = await r.json();
        if (j?.ok && Array.isArray(j.items) && j.items.length) {
          const sub = j.items[0];
          setH1(sub.h1 || sub.name);
          setContent(sub.contentHtml || "");
          setHeroImage(normalizeSrc(sub.image || ""));
        }
      } catch {
        // noop
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategory, category]);

  // Применение фильтров/сортировки/пагинации
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, priceRange, sortOption, products, currentPage]);

  const handleBrandFilterChange = (selected) => setSelectedBrands(selected);
  const handleSortChange = (e) => setSortOption(e.target.value);
  const handlePriceChange = (type, value) =>
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  const handleResetPriceFilter = () => setPriceRange({ from: "", to: "" });
  const handlePageChange = (n) => setCurrentPage(n);

  const applyFilters = () => {
    let list = [...products];

    if (priceRange.from !== "")
      list = list.filter((p) => Number(p.price) >= parseFloat(priceRange.from));
    if (priceRange.to !== "")
      list = list.filter((p) => Number(p.price) <= parseFloat(priceRange.to));

    if (selectedBrands.length > 0)
      list = list.filter((p) => selectedBrands.includes(p.brand));

    if (sortOption === "PriceLowToHigh")
      list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortOption === "PriceHighToLow")
      list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortOption === "Rating")
      list.sort((a, b) => Number(b.rating) - Number(a.rating));

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setFilteredProducts(list.slice(start, end));
    setTotalItems(list.length);
  };

  const unoptHero = typeof heroImage === "string" && heroImage.startsWith("/uploads/");

  return (
    <div className="container mx-auto pt-2 pb-20">
      <Breadcrumbs />

      {/* === HERO на фото подкатегории (без затемнения) === */}
      <section
        className="relative w-full overflow-hidden rounded-2xl sd:h-80 xz:h-[180px] mt-4"
        aria-label={h1 || "Подкатегория"}
      >
        <Image
          src={heroImage || "/images/banner/banner.webp"}
          alt={h1 || "Изображение подкатегории"}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized={unoptHero}  // важно для прод при /uploads/...
        />
      </section>

      {/* H1 ПОД изображением */}
      <h1 className="text-center font-extrabold tracking-tight sd:text-5xl xz:text-3xl mt-8 mb-10">
        {h1}
      </h1>

      {!loaded ? (
        <div className="p-12 flex min-h-88">
          <span className="m-auto loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <div className="px-2 py-4 flex relative">
          {/* Сайдбар фильтров — десктоп */}
          <div className="">
            <div className="sd:block xz:hidden sticky top-10">
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
          </div>

          {/* Контент */}
          <div className="sd:pl-4 xz:pl-0 flex-1">
            <div>
              <p>{totalItems} товаров</p>
            </div>

            {/* Панель сортировки + вид + мобильный фильтр */}
            <div className="pt-[1.7rem] pb-2 flex flex-col items-center">
              <div className="flex justify-between w-full space-x-2">
                <div className="sd:hidden xz:block drawer z-40">
                  <input id="my-drawer4" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label
                      htmlFor="my-drawer4"
                      className="btn btn-xs btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item"
                    >
                      <RiFilter2Line fontSize={20} />
                      <span>Фильтр</span>
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

                {/* Сортировка + переключатель вида */}
                <div className="flex justify-between items-center gap-2 w-full mb-8">
                  <div className="w-full">
                    <select
                      id="SortBy"
                      className="select select-xs min-h-0 h-10 border-gray-300 rounded-lg"
                      onChange={handleSortChange}
                      value={sortOption}
                    >
                      <option value="">Сортировать</option>
                      <option value="PriceLowToHigh">По увеличении цены</option>
                      <option value="PriceHighToLow">По уменьшении цены</option>
                      <option value="Rating">Рейтингу</option>
                    </select>
                  </div>

                  <div className="join space-x-2">
                    <button
                      className={`btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item ${
                        isListView ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setIsListView(true)}
                      aria-label="Список"
                    >
                      <RiListCheck2 />
                    </button>
                    <button
                      className={`btn btn-outline border-gray-300 bg-white py-2 px-3 min-h-0 h-10 rounded-lg join-item ${
                        !isListView ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setIsListView(false)}
                      aria-label="Плитка"
                    >
                      <RiLayoutGridLine />
                    </button>
                  </div>
                </div>
              </div>

              {/* Список товаров */}
              <ProductList
                products={filteredProducts}
                isListView={isListView}
                categorySlug={category}
                subcategorySlug={subcategory}
              />

              {/* Пагинация */}
              <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}

      {content ? (
        <div className="relative z-10 overflow-hidden py-20 mt-9">
          <div
            className="prose max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Image
            src="/images/anime/anime.webp"
            alt="Аниме фигурка"
            width={300}
            height={300}
            className="absolute sd:top-1/2 xz:top-0 sd:right-0 xz:-right-8 -z-10 sd:w-[300px] xz:w-[200px]"
          />
          <Image
            src="/images/anime/anime-2.webp"
            alt="Аниме фигурка"
            width={200}
            height={200}
            className="absolute sd:-bottom-16 xz:bottom-0 -left-4 -z-10"
          />
        </div>
      ) : null}
    </div>
  );
}

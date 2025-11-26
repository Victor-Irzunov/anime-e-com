// /components/CategoryMenu.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiMenu2Line } from "react-icons/ri";
import { AiTwotoneHome } from "react-icons/ai";

function CategoryMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const [activeCatId, setActiveCatId] = useState(null); // активная категория для второй строки

  const handleDrawerClose = () => setIsDrawerOpen(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const r = await fetch("/api/public/navigation", { cache: "no-store" });
        const j = await r.json();
        if (isMounted && j?.ok) {
          setCats(j.items || []);
          if (j.items?.length) {
            setActiveCatId(j.items[0].id); // по умолчанию первая категория
          }
        }
      } catch (e) {
        console.error("load navigation error:", e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const activeCat = cats.find((c) => c.id === activeCatId);
  const activeSubs = Array.isArray(activeCat?.subcategories)
    ? activeCat.subcategories
    : [];

  return (
    <div className="border-b border-b-gray-300 bg-white sd:block xz:hidden pt-20">
      <div className="container mx-auto">
        <div className="layout-w px-2">
          <div className="py-3">
            <div className="flex items-center gap-6 text-xs">
              {/* === БУРГЕР (моб. меню категорий) === */}
              <div className="drawer z-50 w-auto">
                <input
                  id="my-drawer2"
                  type="checkbox"
                  className="drawer-toggle"
                  checked={isDrawerOpen}
                  onChange={() => setIsDrawerOpen(!isDrawerOpen)}
                />
                <div className="drawer-content">
                  <label
                    htmlFor="my-drawer2"
                    className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <RiMenu2Line fontSize={18} />
                    Все категории
                  </label>
                </div>
                <div className="drawer-side">
                  <label
                    htmlFor="my-drawer2"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  />
                  <div className="menu xz:px-4 sd:px-8 xz:py-4 sd:py-10 sd:w-[500px] xz:w-80 min-h-full bg-base-200 text-base-content">
                    <div className="px-4 mb-5 font-medium">
                      <Link
                        href={`${base}/`}
                        className="text-xl"
                        onClick={handleDrawerClose}
                      >
                        <AiTwotoneHome fontSize={26} />
                      </Link>
                    </div>

                    <p className="text-xl font-semibold">Все категории</p>

                    <div>
                      {cats.map((el) => (
                        <details
                          className="collapse collapse-plus bg-base-200"
                          key={el.id}
                        >
                          <summary className="collapse-title text-xl font-medium">
                            <Link
                              href={`${base}/${el.value}`}
                              className="underline"
                              onClick={handleDrawerClose}
                            >
                              {el.name}
                            </Link>
                          </summary>
                          {(el.subcategories || []).map((sub) => (
                            <div
                              className="collapse-content flex items-center"
                              key={sub.id}
                            >
                              <Link
                                href={`${base}/${el.value}/${sub.value}`}
                                className="ml-1 underline"
                                onClick={handleDrawerClose}
                              >
                                {sub.name}
                              </Link>
                            </div>
                          ))}
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* === ССЫЛКА НА ГЛАВНУЮ === */}
              <Link href={`${base}/`} className="text-xs whitespace-nowrap">
                Главная
              </Link>

              {/* === БЛОК КАТЕГОРИЙ + ПОДКАТЕГОРИИ ВО ВТОРОЙ СТРОКЕ === */}
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                {/* Ряд категорий с горизонтальным скроллом */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {cats.map((cat) => {
                    const isActive = cat.id === activeCatId;
                    return (
                      <Link
                        key={cat.id}
                        href={`${base}/${cat.value}`}
                        onMouseEnter={() => setActiveCatId(cat.id)}
                        onFocus={() => setActiveCatId(cat.id)}
                        className={
                          "btn btn-xs rounded-xl px-3 py-1 whitespace-nowrap transition-opacity " +
                          (isActive ? "opacity-100" : "opacity-80 hover:opacity-100")
                        }
                        style={{
                          background: "linear-gradient(90deg,#27E9E2,#1C7EEC)",
                          color: "#001B2F",
                        }}
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Ряд подкатегорий активной категории, тоже со скроллом */}
                {activeSubs.length > 0 && (
                  <div className="mt-1 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 text-[11px]">
                      {activeSubs.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`${base}/${activeCat.value}/${sub.value}`}
                          className="px-3 py-1 rounded-full border border-gray-200 hover:bg-base-200 whitespace-nowrap"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* === /БЛОК КАТЕГОРИЙ === */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryMenu;

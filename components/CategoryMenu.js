// /components/CategoryMenu.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiMenu2Line } from "react-icons/ri";
import { AiTwotoneHome } from "react-icons/ai";

function CategoryMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const [hoveredId, setHoveredId] = useState(null); // для ховера подкатегорий (desktop)

  const handleDrawerClose = () => setIsDrawerOpen(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const r = await fetch("/api/public/navigation", { cache: "no-store" });
        const j = await r.json();
        if (isMounted && j?.ok) setCats(j.items || []);
      } catch (e) {
        console.error("load navigation error:", e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <div className="border-b border-b-gray-300 bg-white sd:block xz:hidden">
      <div className="container mx-auto">
        <div className="layout-w px-2">
          <div className="py-3">
            <div className="flex items-center gap-6 text-sm">
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
                    className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer"
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
              <Link href={`${base}/`} className="">
                Главная
              </Link>

              {/* === ГОРИЗОНТАЛЬНОЕ МЕНЮ КАТЕГОРИЙ С ВЫПАДАЮЩИМИ ПОДКАТЕГОРИЯМИ (hover) === */}
              <nav className="flex items-center gap-4 relative">
                {cats.map((cat) => (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => setHoveredId(cat.id)}
                    onMouseLeave={() => setHoveredId((prev) => (prev === cat.id ? null : prev))}
                  >
                    {/* ссылка категории */}
                    <Link
                      href={`${base}/${cat.value}`}
                      className="hover:opacity-80 transition-opacity py-2 inline-block"
                    >
                      {cat.name}
                    </Link>

                    {/* выпадающий список подкатегорий */}
                    {Array.isArray(cat.subcategories) &&
                      cat.subcategories.length > 0 && hoveredId === cat.id && (
                        <div
                          className="absolute left-0 top-6 z-50 bg-white border border-gray-200 rounded-lg shadow mt-2 min-w-[16rem] p-2"
                        >
                          <ul className="menu menu-sm">
                            {cat.subcategories.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  href={`${base}/${cat.value}/${sub.value}`}
                                  className="py-2 px-3 hover:bg-base-200 rounded-md"
                                  onClick={() => {
                                    // Закрыть выпадающее меню сразу по клику
                                    setHoveredId(null);
                                    // Снять фокус с активного элемента (JS без TS-кастов)
                                    const active = document.activeElement;
                                    if (active && typeof active.blur === "function") {
                                      active.blur();
                                    }
                                  }}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryMenu;

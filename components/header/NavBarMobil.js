// /components/Header/NavBarMobil.jsx
"use client";
import Link from "next/link";
import { RiMenu4Fill } from "react-icons/ri";
import { AiTwotoneHome } from "react-icons/ai";

const NavBarMobil = ({
  isDrawerOpen,
  toggleDrawer,
  closeDrawer,
  menu = [],
}) => {
  return (
    <nav className="xz:block sd:hidden overflow-x-hidden z-50">
      {/* скрытый чекбокс и кнопка-бургер.
         сам бургер у тебя будет вызываться через <label htmlFor="my-drawer">,
         в нижнем фикс-баре тоже есть label htmlFor="my-drawer"
      */}
      <div className="drawer z-50 w-auto">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={toggleDrawer}
        />
        <div className="drawer-content">{/* пусто, бургер живёт в нижнем меню */}</div>

        <div className="drawer-side z-70">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={closeDrawer}
          ></label>

          <div className="menu xz:px-4 sd:px-8 xz:py-16 sd:py-10 sd:w-[500px] xz:w-80 min-h-full bg-base-200 text-base-content">
            <div className="px-4 mb-5 font-medium">
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/`}
                className="text-xl flex items-center gap-2"
                onClick={closeDrawer}
              >
                <AiTwotoneHome fontSize={26} />
                <span>Главная</span>
              </Link>
            </div>

            <p className="sd:text-xl xz:text-lg font-semibold">
              Все категории
            </p>

            <div>
              {menu.map((el) => (
                <details
                  className="collapse collapse-plus bg-base-200"
                  key={el.id}
                >
                  <summary className="collapse-title sd:text-xl xz:text-base font-medium">
                    <Link
                      href={`/${el.value}`}
                      className="underline"
                      onClick={closeDrawer}
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
                        href={`/${el.value}/${sub.value}`}
                        className="ml-1 underline"
                        onClick={closeDrawer}
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
    </nav>
  );
};

export default NavBarMobil;

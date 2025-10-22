// /components/Header/index.jsx
"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { MyContext } from "@/contexts/MyContextProvider";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiShoppingBagLine, RiShoppingBasket2Fill, RiUser3Line, RiLoginCircleFill, RiShoppingCartLine } from "react-icons/ri";
import Image from "next/image";
import { searchProduct } from "@/http/productsAPI";
import NavBarMobil from "./NavBarMobil";
import ModalSearch from "../modal/ModalSearch";

const Header = observer(() => {
  const { user, dataApp } = useContext(MyContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("/api/catalog/categories")
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok) setMenu(j.items || []);
      });
  }, []);

  const toggleDrawer = () => setIsDrawerOpen((s) => !s);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <header className="">
      <div className='border-b border-b-gray-300 bg-white'>
        <div className="container mx-auto">
          <nav className="xz:hidden sd:block">
            <div className="navbar bg-base-100 py-0 layout-w">
              <div className="navbar-start">
                <Link href={"/"} className="">
                  <Image src='/logo/logo.webp' alt='Логотип - магазины аниме в Минске' width={100} height={80} />
                </Link>
              </div>

              <div className="navbar-center">
                <div className="w-96">
                  <div
                    className="w-full border h-8 rounded-full text-center py-1 flex justify-center items-center cursor-pointer"
                    onClick={() => setModalVisible(true)}
                  >
                    <Image src="/images/svg/search.svg" alt="Поиск товара" width={18} height={18} />
                    <p className="text-gray-400 font-light ml-2">Поиск товара</p>
                  </div>
                  <ModalSearch modalVisible={modalVisible} setModalVisible={setModalVisible} />
                </div>
              </div>

              <div className="navbar-end gap-1">
                {user.userData?.isAdmin ? (
                  <Link href="/super-admin" className="flex flex-col items-center text-gray-500 rounded-lg p-2 min-w-16 gap-1 hover:opacity-80 transition-opacity">
                    <div className="indicator">
                      <MdOutlineAdminPanelSettings fontSize={20} />
                    </div>
                    <span className="text-xs">Админка</span>
                  </Link>
                ) : null}

                {!user.isAuth ? (
                  <Link href="/login" className="flex flex-col items-center text-gray-500 rounded-lg p-2 min-w-16 gap-1 hover:opacity-80 transition-opacity">
                    <div className="indicator">
                      <RiLoginCircleFill fontSize={20} />
                    </div>
                    <span className="text-xs">Вход</span>
                  </Link>
                ) : (
                  <Link href="/profile" className="flex flex-col items-center text-gray-500 rounded-lg p-2 min-w-16 gap-1 hover:opacity-80 transition-opacity">
                    <div className="indicator">
                      <RiUser3Line fontSize={20} />
                    </div>
                    <span className="text-xs">Профиль</span>
                  </Link>
                )}

                <Link href="/zakazy" className="flex flex-col items-center text-gray-500 rounded-lg p-2 min-w-16 gap-1 hover:opacity-80 transition-opacity">
                  <div className="indicator">
                    <RiShoppingBagLine fontSize={20} />
                  </div>
                  <span className="text-xs">Заказы</span>
                </Link>

                <Link href="/korzina" className="flex flex-col items-center text-gray-500 rounded-lg p-2 min-w-16 gap-1 hover:opacity-80 transition-opacity">
                  <div className="indicator">
                    {dataApp.dataKorzina.length ? (
                      <span className="indicator-item px-1 w-4 h-4 text-[10px] font-semibold badge badge-secondary">{dataApp.dataKorzina.length}</span>
                    ) : null}
                    <RiShoppingCartLine fontSize={20} />
                  </div>
                  <span className="text-xs">Корзина</span>
                </Link>
              </div>
            </div>
          </nav>

          <NavBarMobil
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            closeDrawer={closeDrawer}
            user={user}
            dataApp={dataApp}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            menu={menu}
          />
        </div>

      </div>

      <div className='sd:hidden xz:block py-8'>
        <Link href={"/"} className="flex items-center justify-center">
          <Image src='/logo/logo.webp' alt='Логотип - магазины аниме в Минске' width={150} height={100} />
        </Link>
      </div>


    </header>
  );
});

export default Header;

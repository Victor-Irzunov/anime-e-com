// /components/header/MobileBottomBar.jsx — НОВЫЙ ФАЙЛ (добавлена 5-я кнопка "Позвонить")
"use client";

import Link from "next/link";
import { useContext } from "react";
import { MyContext } from "@/contexts/MyContextProvider";
import phoneNumbers from "@/config/config";
import { AiTwotoneHome } from "react-icons/ai";
import {
  RiMenu4Fill,
  RiUser3Line,
  RiLoginCircleFill,
  RiShoppingCartLine,
  RiPhoneLine,
} from "react-icons/ri";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export default function MobileBottomBar() {
  const { user, dataApp } = useContext(MyContext);

  return (
    <div className="sd:hidden xz:block fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      {/* 5 колонок: Главная / Меню / Профиль|Админ|Вход / Корзина / Позвонить */}
      <nav className="grid grid-cols-5">
        {/* 1. Домой */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center py-2 border-r border-gray-200 hover:bg-gray-50"
        >
          <AiTwotoneHome fontSize={22} className="text-blue-700" />
          <span className="text-[10px] text-blue-600">Главная</span>
        </Link>

        {/* 2. Меню (drawer) */}
        <label
          htmlFor="my-drawer"
          className="flex flex-col items-center justify-center py-2 border-r border-gray-200 hover:bg-gray-50 cursor-pointer"
        >
          <RiMenu4Fill fontSize={24} className="text-blue-600" />
          <span className="text-[10px] text-blue-600">Меню</span>
        </label>

        {/* 3. Профиль / Админ / Вход */}
        {user?.userData?.isAdmin ? (
          <Link
            href="/super-admin"
            className="flex flex-col items-center justify-center py-2 border-r border-gray-200 hover:bg-gray-50"
          >
            <MdOutlineAdminPanelSettings fontSize={22} className="text-blue-700" />
            <span className="text-[10px] text-blue-600">Админ</span>
          </Link>
        ) : user?.isAuth ? (
          <Link
            href="/profile"
            className="flex flex-col items-center justify-center py-2 border-r border-gray-200 hover:bg-gray-50"
          >
            <RiUser3Line fontSize={22} className="text-blue-700" />
            <span className="text-[10px] text-blue-600">Профиль</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center justify-center py-2 border-r border-gray-200 hover:bg-gray-50"
          >
            <RiLoginCircleFill fontSize={22} className="text-blue-700" />
            <span className="text-[10px] text-blue-600">Вход</span>
          </Link>
        )}

        {/* 4. Корзина */}
        <Link
          href="/korzina"
          className="relative flex flex-col items-center justify-center py-2 border-r border-gray-200 hover:bg-gray-50"
        >
          {dataApp?.dataKorzina?.length ? (
            <span className="absolute top-1 right-3 text-[10px] px-1 h-4 min-w-4 rounded-full bg-secondary text-white flex items-center justify-center">
              {dataApp.dataKorzina.length}
            </span>
          ) : null}
          <RiShoppingCartLine fontSize={22} className="text-blue-700" />
          <span className="text-[10px] text-blue-600">Корзина</span>
        </Link>

        {/* 5. Позвонить */}
        <a
          href={`tel:${phoneNumbers.phone1Link || ""}`}
          className="flex flex-col items-center justify-center py-2 hover:bg-gray-50"
        >
          <RiPhoneLine fontSize={22} className="text-blue-700" />
          <span className="text-[10px] text-blue-600">Позвонить</span>
        </a>
      </nav>
    </div>
  );
}

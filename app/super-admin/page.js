// /app/super-admin/page.jsx — ПОЛНОСТЬЮ
"use client";
import Link from "next/link";
import CreateProductForm from "@/components/FormsAdmin/CreateProductForm";
import EditProductForm from "@/components/FormsAdmin/EditProductForm";
import GetProductForm from "@/components/FormsAdmin/GetProductForm";
import ManageCategories from "@/components/FormsAdmin/ManageCategories";
import ManageSubCategories from "@/components/FormsAdmin/ManageSubCategories";
import ManageBrands from "@/components/FormsAdmin/ManageBrands";
import HideAntdCompatWarning from "@/components/utils/HideAntdCompatWarning";
import { useState } from "react";
import DuplicateProductForm from "@/components/FormsAdmin/DuplicateProductForm";

export default function Page() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* Монтируем один раз сверху страницы админа */}
      <HideAntdCompatWarning />

      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="sd:text-3xl xz:text-xl uppercase">Страница администратора</h1>

            {/* 🔗 Быстрые ссылки */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/super-admin/orders" className="btn btn-primary btn-sm">
                Отслеживание заказов
              </Link>
              <Link href="/zakazy" className="btn btn-outline btn-sm">
                Заказы (вид от пользователя)
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <div className="collapse collapse-plus border border-base-300 bg-amber-100">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">Управление категориями</div>
              <div className="collapse-content">
                <ManageCategories />
              </div>
            </div>

            <div className="collapse collapse-plus border border-base-300 bg-yellow-100 mt-6">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">Управление подкатегориями</div>
              <div className="collapse-content">
                <ManageSubCategories />
              </div>
            </div>

            <div className="collapse collapse-plus border border-base-300 bg-orange-100 mt-6">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">Управление Фандомами (аниме)</div>
              <div className="collapse-content">
                <ManageBrands />
              </div>
            </div>

            <div className="collapse collapse-plus border border-base-300 bg-emerald-200 mt-6">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">Добавить товар</div>
              <div className="collapse-content">
                <CreateProductForm />
              </div>
            </div>

            <div className="collapse collapse-plus border border-base-300 bg-lime-200 mt-6">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">Редактировать товар</div>
              <div className="collapse-content">
                <GetProductForm setIsActive={setIsActive} />
                <div className="mt-10">{isActive ? <EditProductForm /> : null}</div>
              </div>
            </div>

            {/* 🔸 НОВАЯ СЕКЦИЯ: Быстрое копирование товара */}
            <div className="collapse collapse-plus border border-base-300 bg-sky-100 mt-6">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">Быстрое копирование товара (цвета/варианты)</div>
              <div className="collapse-content">
                <DuplicateProductForm />
              </div>
            </div>

            {/* 🔗 Дублирующая ссылка внизу */}
            <div className="mt-10 text-center">
              <Link href="/super-admin/orders" className="btn btn-primary">
                Перейти к отслеживанию заказов
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

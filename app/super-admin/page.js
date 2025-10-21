// /app/super-admin/page.jsx
"use client";
import CreateProductForm from "@/components/FormsAdmin/CreateProductForm";
import EditProductForm from "@/components/FormsAdmin/EditProductForm";
import GetProductForm from "@/components/FormsAdmin/GetProductForm";
import ManageCategories from "@/components/FormsAdmin/ManageCategories";
import ManageSubCategories from "@/components/FormsAdmin/ManageSubCategories";
import ManageBrands from "@/components/FormsAdmin/ManageBrands";
import HideAntdCompatWarning from "@/components/utils/HideAntdCompatWarning";
import { useState } from "react";

const page = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* Монтируем один раз сверху страницы админа */}
      <HideAntdCompatWarning />

      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="sd:text-3xl xz:text-xl uppercase">Страница администратора</h1>
          </div>

          <div className="mt-10">
            <div className="collapse collapse-plus border border-base-300 bg-amber-100">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                Управление категориями
              </div>
              <div className="collapse-content">
                <ManageCategories />
              </div>
            </div>

            <div className="collapse collapse-plus border border-base-300 bg-yellow-100 mt-6">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                Управление подкатегориями
              </div>
              <div className="collapse-content">
                <ManageSubCategories />
              </div>
            </div>

            <div className="collapse collapse-plus border border-base-300 bg-orange-100 mt-6">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium">
                Управление брендами (аниме)
              </div>
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
          </div>
        </div>
      </section>
    </>
  );
};

export default page;

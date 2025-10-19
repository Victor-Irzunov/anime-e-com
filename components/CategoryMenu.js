"use client"
import { useState } from 'react';
import { CATEGORY_LINKS } from "@/lib/const/navigation"
import Link from "next/link"
import { RiMenu2Line } from "react-icons/ri"
import { AiTwotoneHome } from "react-icons/ai"
import Image from "next/image"
import { dataCategory } from "@/lib/const/categoryData"

function CategoryMenu() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Добавляем состояние для открытия/закрытия меню

    const handleDrawerClose = () => {
        setIsDrawerOpen(false); // Функция для закрытия меню
    };

    return (
        <div className="border-b border-b-gray-300 bg-white sd:block xz:hidden">
            <div className='container mx-auto'>
                <div className="layout-w px-2">
                    <div className="py-3">

                        <div className="flex items-center gap-6 text-sm">
                            <div className="drawer z-50 w-auto">
                                <input id="my-drawer2" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={() => setIsDrawerOpen(!isDrawerOpen)} /> {/* Используем состояние для управления открытием/закрытием меню */}
                                <div className="drawer-content">
                                    <label htmlFor="my-drawer2" className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer">
                                        <RiMenu2Line fontSize={18} />
                                        Все категории
                                    </label>
                                </div>
                                <div className="drawer-side">
                                    <label htmlFor="my-drawer2" aria-label="close sidebar" className="drawer-overlay"></label>

                                    <div className="menu xz:px-4 sd:px-8 xz:py-4 sd:py-10 sd:w-[500px] xz:w-80 min-h-full bg-base-200 text-base-content">
                                        <div className='px-4 mb-5 font-medium'>
                                            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`} className="text-xl">
                                                <AiTwotoneHome fontSize={26} onClick={handleDrawerClose} /> {/* Добавляем обработчик для закрытия меню */}
                                            </Link>
                                        </div>

                                        <p className='text-xl font-semibold'>
                                            Все категории
                                        </p>

                                        <div className=''>
                                            {dataCategory.map(el => {
                                                return (
                                                    <details className="collapse collapse-plus bg-base-200" key={el.id}>
                                                        <summary className="collapse-title text-xl font-medium">
                                                            <Link
                                                                href={`${process.env.NEXT_PUBLIC_BASE_URL}/${el.link}`}
                                                                className="underline"
                                                                onClick={handleDrawerClose}
                                                            >
                                                                {el.title}
                                                            </Link>
                                                        </summary>
                                                        {
                                                            el.children.map(elem => {
                                                                return (
                                                                    <div className="collapse-content flex items-center" key={elem.id}>
                                                                        <Image src={elem.img} alt={elem.alt} width={60} height={60} />
                                                                        <Link
                                                                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${elem.link}`}
                                                                            className="ml-3 underline"
                                                                            onClick={handleDrawerClose}>
                                                                            {elem.name}
                                                                        </Link>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </details>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`${process.env.NEXT_PUBLIC_BASE_URL}/`}
                                className=''
                            >
                                Главная
                            </Link>

                            {dataCategory.map((cat, idx) => (
                                <Link
                                    key={cat.link + idx}
                                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/${cat.link}`}
                                    className="hover:opacity-80 transition-opacity"
                                    onClick={handleDrawerClose}
                                >
                                    {cat.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CategoryMenu

// /components/ImgProductDetails.js
"use client";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import {
  RiAddFill,
  RiCheckboxCircleFill,
  RiShieldCheckFill,
  RiSubtractFill,
} from "react-icons/ri";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MyContext } from "@/contexts/MyContextProvider";
import QuickBuyForm from "@/components/Form/QuickBuyForm";

const ImgProductDetails = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // full-screen gallery
  const [quantity, setQuantity] = useState(1);
  const { updateState } = useContext(MyContext);

  // dialog refs + timer
  const cartDialogRef = useRef(null); // my_modal_1
  const quickBuyDialogRef = useRef(null); // my_modal_3
  const autoCloseTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    },
    []
  );

  const imagesArr = Array.isArray(product.images)
    ? product.images
    : (() => {
        try {
          return JSON.parse(product.images || "[]");
        } catch {
          return [];
        }
      })();

  const imageUrlAt = (idx) => {
    const url = imagesArr[idx]?.url || imagesArr[idx]?.image || "";
    return url?.startsWith("http")
      ? url
      : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${url}`;
  };

  const handleIncrementQuantity = () => setQuantity((q) => q + 1);
  const handleDecrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const i = existingCart.findIndex((x) => x.id === product.id);
    if (i !== -1) existingCart[i].quantity += quantity;
    else
      existingCart.push({
        id: product.id,
        title: product.title,
        category: product.category,
        quantity,
      });
    localStorage.setItem("cart", JSON.stringify(existingCart));
    updateState();

    cartDialogRef.current?.showModal?.();
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    autoCloseTimerRef.current = setTimeout(() => {
      if (cartDialogRef.current?.open) cartDialogRef.current.close();
    }, 4000);
  };

  const handlePrevImage = () =>
    setSelectedImageIndex(
      (i) => (i - 1 + imagesArr.length) % imagesArr.length
    );
  const handleNextImage = () =>
    setSelectedImageIndex((i) => (i + 1) % imagesArr.length);

  // рендер описания: если есть "+" — считаем их разделителем строк
  const renderDescription = (desc) => {
    if (!desc) return null;

    const parts = desc
      .split("+")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length <= 1) {
      return <p>{desc}</p>;
    }

    return (
      <ul className="space-y-1">
        {parts.map((part, idx) => (
          <li key={idx}>{part}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 flex sd:flex-row xz:flex-col gap-6">
      <div>
        {/* главное изображение — показываем в полный рост (object-contain) */}
        <div className="sd:w-lg xz:w-auto aspect-4/3 overflow-hidden rounded-lg border border-gray-300 bg-white">
          <div
            className="w-full h-full cursor-pointer flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={imageUrlAt(selectedImageIndex)}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 overflow-x-auto sd:w-lg xz:w-auto">
          <div className="flex">
            {imagesArr.map((img, idx) => {
              const src = img.url || img.image || "";
              const thumb = src.startsWith("http")
                ? src
                : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${src}`;
              return (
                <div
                  key={`${src}-${idx}`}
                  className={`w-28 h-28 rounded border mx-1 overflow-hidden cursor-pointer ${
                    idx === selectedImageIndex
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img
                    src={thumb}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h2 className="font-medium text-xl">{product.title}</h2>
        <p className="text-sm">
          Бренд:{" "}
          <Link href="#" className="link link-primary no-underline">
            {product.brand}
          </Link>
        </p>
        <div className="pb-3 pt-1 text-sm text-gray-400">
          На складе: {product.stock}
        </div>
        <div className="pb-3 pt-1 text-sm text-gray-400">
          Артикль: {product.id}
        </div>

        {/* только цена без скидки */}
        <div className="pt-1 flex items-center gap-3">
          <strong className="text-2xl font-medium text-gray-800">
            {product.price.toFixed(2)} руб
          </strong>
        </div>

        {/* блок рейтинга со звёздами и скидкой удалён по задаче */}

        <div className="badge badge-lg bg-emerald-600 text-white gap-2 pl-1.5 mt-3">
          <RiCheckboxCircleFill fontSize={18} /> Рекомендуем
        </div>

        <div className="py-4 max-w-lg">{renderDescription(product.description)}</div>

        <div className="join py-4">
          <button
            onClick={handleDecrementQuantity}
            className="join-item btn btn-sm px-2 border border-gray-300"
          >
            <RiSubtractFill fontSize={20} />
          </button>
          <input
            value={quantity}
            readOnly
            className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300 w-14"
          />
          <button
            onClick={handleIncrementQuantity}
            className="join-item btn btn-sm px-2 border border-gray-300"
          >
            <RiAddFill fontSize={20} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            className="btn btn-secondary capitalize"
            onClick={() => quickBuyDialogRef.current?.showModal?.()}
          >
            Быстрая покупка
          </button>
          <button
            className="btn btn-accent capitalize text-white"
            onClick={handleAddToCart}
          >
            В корзину
          </button>
        </div>

        <div className="pt-4 flex items-center gap-3 text-sm text-gray-500">
          <RiShieldCheckFill fontSize={22} />
          {/* убрали фразу "Простой возврат" */}
          Быстрая доставка.
        </div>
      </div>

      {/* полноэкранная галерея */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white p-8 rounded-lg max-w-2xl w-full cursor-pointer">
            <img
              src={imageUrlAt(selectedImageIndex)}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              className="absolute top-1/2 -translate-y-1/2 left-4"
              onClick={handlePrevImage}
            >
              <BsChevronLeft className="text-3xl text-gray-700 hover:text-gray-900" />
            </button>
            <button
              className="absolute top-1/2 -translate-y-1/2 right-4"
              onClick={handleNextImage}
            >
              <BsChevronRight className="text-3xl text-gray-700 hover:text-gray-900" />
            </button>
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsModalOpen(false)}
              aria-label="Закрыть"
            >
              <span className="text-3xl font-bold">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* модалки */}
      <dialog ref={quickBuyDialogRef} id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </form>

          <p className="font-bold text-lg mb-2">Быстрая покупка</p>
          <div className="mb-3 text-sm">
            {product.title} ·{" "}
            <span className="font-medium">
              {(product.price * quantity).toFixed(2)} руб
            </span>
          </div>

          <div className="modal-action block">
            <QuickBuyForm
              product={product}
              quantity={quantity}
              onClose={() => quickBuyDialogRef.current?.close?.()}
            />
          </div>
        </div>
      </dialog>

      <dialog ref={cartDialogRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="font-bold text-lg mb-3">Товар добавлен в корзину</p>
          <p className="font-bold text-lg">{product.title}</p>
          <div className="flex items-center justify-between">
            <div className="w-28 h-28 mt-5 mb-3 rounded-lg overflow-hidden border border-gray-300">
              <img
                src={imageUrlAt(0)}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <strong className="text-2xl font-medium text-gray-800">
              {product.price.toFixed(2)} руб
            </strong>
          </div>
          <div className="modal-action">
            <Link href="/korzina" className="btn">
              Перейти в корзину
            </Link>
            <form method="dialog">
              <button className="btn">Продолжить покупки</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ImgProductDetails;

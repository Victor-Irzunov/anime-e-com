"use client";

import { useState } from "react";
import Modal from "../modal/Modal";
import Image from "next/image";

const BtnComp = ({ title, index = "default", center, name, consult, color, w, bg, small, img }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const open = (product) => {
    setSelectedProduct(product);
    const el = document.getElementById(`my_modal_${index}`);
    if (el?.showModal) el.showModal();
  };

  const close = () => {
    const el = document.getElementById(`my_modal_${index}`);
    el?.close();
  };

  return (
    <div className={`flex items-center ${center ? "justify-center" : ""}`}>
      <button
        type="button"
        onClick={() => open(name || title)}
        aria-haspopup="dialog"
        aria-controls={`my_modal_${index}`}
        className={`
          ${w ? "w-full" : "sd:w-auto xz:w-full"}
          btn border-none active:scale-95 rounded-xl text-center transition
          ${small ? "sd:btn-md xz:btn-sm" : "btn-lg"}
          ${color ? color : "bg-white text-primary hover:shadow-lg"}
        `}
        style={{ minHeight: "48px", paddingInline: "22px" }}
      >
        {title}
        <span className={`${img ? "inline-flex" : "hidden"} ml-2`}>
          <Image src="/images/svg/arrow-white.svg" alt=">" width={22} height={22} />
        </span>
      </button>

      <Modal
        selectedProduct={selectedProduct}
        closeModal={close}
        isFormSubmitted={isFormSubmitted}
        setIsFormSubmitted={setIsFormSubmitted}
        index={index}
        consult={consult}
        exit
      />
    </div>
  );
};

export default BtnComp;

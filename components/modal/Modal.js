"use client";

import { useEffect, useRef } from "react";
import FormSupport from "../Form/FormSupport";

const Modal = ({ selectedProduct, closeModal, isFormSubmitted, setIsFormSubmitted, index, consult }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const el = dialogRef.current;
    const onCancel = (e) => e.preventDefault(); // чтобы Esc не закрывал без нашего обработчика
    if (el) el.addEventListener("cancel", onCancel);
    return () => el && el.removeEventListener("cancel", onCancel);
  }, []);

  return (
    <dialog
      id={`my_modal_${index}`}
      ref={dialogRef}
      className="modal text-black"
      aria-labelledby={`modal_title_${index}`}
      onClick={(e) => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const rect = dialog.querySelector(".modal-box")?.getBoundingClientRect();
        if (!rect) return;
        const clickedOutside =
          e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
        if (clickedOutside) closeModal();
      }}
    >
      {!isFormSubmitted ? (
        <div className="modal-box p-5 sd:p-7 rounded-2xl">
          <div className="flex items-start justify-between gap-4">
            <p id={`modal_title_${index}`} className="font-semibold text-lg sd:text-xl">
              {selectedProduct || "Заявка"}
            </p>
            <button
              className="btn btn-sm btn-circle btn-ghost text-black"
              type="button"
              aria-label="Закрыть"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          {consult ? (
            <div className="pt-3">
              <p className="uppercase text-green-600 text-xs">БЕСПЛАТНО</p>
              <ul className="mt-2 uppercase text-[11px] font-light space-y-1.5">
                <li>• Проконсультируем</li>
                <li>• Подберём оптимальный вариант</li>
                <li>• Сделаем расчёт стоимости</li>
              </ul>
            </div>
          ) : (
            <p className="py-1 mt-2 text-sm text-gray-600">Заполните форму — мы свяжемся в ближайшее время.</p>
          )}

          <FormSupport
            selectedProduct={selectedProduct}
            closeModal={closeModal}
            setIsFormSubmitted={setIsFormSubmitted}
            btn="Отправить"
          />
        </div>
      ) : (
        <div className="modal-box rounded-2xl">
          <p className="text-primary">Ваш запрос успешно отправлен!</p>
        </div>
      )}
    </dialog>
  );
};

export default Modal;

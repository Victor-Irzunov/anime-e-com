// /components/FormOrder/FormOrder.jsx
"use client";

import { MyContext } from "@/contexts/MyContextProvider";
import { orderProduct } from "@/http/productsAPI";
import { userData } from "@/http/userAPI";
import { useContext, useEffect, useState } from "react";
import PhoneInput from "@/components/Form/MaskPhone/PhoneInput"; // заменяем react-input-mask

const FormOrder = ({ closeModalOrder, setIsFormSubmitted, data, setIsActive }) => {
  const { user } = useContext(MyContext);

  const [tel, setTel] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [formDataForm, setFormDataForm] = useState({
    name: "",
    surname: "",
    address: "",
    phone: "",
    message: "",
  });

  // локальная функция для нормализации телефона при первичной подстановке
  const normalizePhone = (raw) => {
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    // приведение к +375 xx xxx-xx-xx
    let d = digits.startsWith("375") ? digits : `375${digits}`;
    d = d.slice(0, 12); // максимум 12 цифр (+ код страны и 9 цифр)
    let formatted = `+375`;
    if (d.length > 3) formatted += ` ${d.slice(3, 5)}`;
    if (d.length > 5) formatted += ` ${d.slice(5, 8)}`;
    if (d.length > 8) formatted += `-${d.slice(8, 10)}`;
    if (d.length > 10) formatted += `-${d.slice(10, 12)}`;
    return formatted;
  };

  useEffect(() => {
    userData().then((data) => {
      if (data) {
        setFormDataForm((prev) => ({
          ...prev,
          name: data.name || "",
          surname: data.surname || "",
          address: data.address || "",
        }));
        if (data.phone) setTel(normalizePhone(data.phone));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Жёсткая проверка телефона: +375 xx xxx-xx-xx => 12 цифр, startsWith 375, валидный код
    const digits = tel.replace(/\D/g, ""); // только цифры
    const validOperators = ["29", "33", "44", "25"];
    const operatorCode = digits.slice(3, 5);

    if (!(digits.length === 12 && digits.startsWith("375") && validOperators.includes(operatorCode))) {
      setAlertText("Введите корректный номер формата +375 xx xxx-xx-xx (коды: 29, 33, 44, 25)");
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 4000);
      return;
    }

    // Собираем позиции заказа
    const orderItems = Array.isArray(data)
      ? data.map((product) => ({
          productId: product.id,
          title: product.title,
          quantity: product.quantity,
          discountPercentage: product.discountPercentage,
          price: product.price,
          totalAmount: product.price * product.quantity,
        }))
      : [];

    const orderData = {
      orderItems: JSON.stringify(orderItems),
      userId: user?.userData?.id,
      name: formDataForm.name,
      surname: formDataForm.surname,
      address: formDataForm.address,
      phone: tel, // отправляем уже отформатированным
      message: formDataForm.message,
    };

    const formData = new FormData();
    formData.append("orderData", JSON.stringify(orderData));

    try {
      const resp = await orderProduct(formData);
      if (resp) {
        setFormDataForm({
          name: "",
          surname: "",
          address: "",
          phone: "",
          message: "",
        });
        setTel("");
        if (typeof setIsActive === "function") setIsActive(false);
        if (typeof setIsFormSubmitted === "function") setIsFormSubmitted(true);
        localStorage.removeItem("cart");
      }
    } catch (err) {
      setAlertText("Ошибка при отправке заказа. Повторите попытку.");
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 4000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataForm({ ...formDataForm, [name]: value });
  };

  return (
    <>
      {alertActive && (
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{alertText || "Введите пожалуйста корректный номер телефона!"}</span>
        </div>
      )}

      <div className="w-full bg-base-100">
        <form onSubmit={handleSubmit}>
          {/* Телефон */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Телефон</span>
              <span className="label-text-alt">Обязательное поле</span>
            </label>

            <PhoneInput
              value={tel}
              onChange={setTel}
              setAlertText={setAlertText}
              setAlertActive={setAlertActive}
            />
          </div>

          {/* Имя */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Имя</span>
              <span className="label-text-alt">Обязательное поле</span>
            </label>
            <input
              type="text"
              name="name"
              value={formDataForm.name}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="Введите ваше имя"
              required
              autoComplete="given-name"
            />
          </div>

          {/* Фамилия */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Фамилия</span>
              <span className="label-text-alt">Обязательное поле</span>
            </label>
            <input
              type="text"
              name="surname"
              value={formDataForm.surname}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="Введите вашу фамилию"
              required
              autoComplete="family-name"
            />
          </div>

          {/* Адрес */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Адрес</span>
              <span className="label-text-alt">Обязательное поле</span>
            </label>
            <input
              type="text"
              name="address"
              value={formDataForm.address}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="Введите ваш адрес"
              required
              autoComplete="street-address"
            />
          </div>

          {/* Комментарий */}
          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Комментарий</span>
              <span className="label-text-alt">Необязательное поле</span>
            </label>
            <textarea
              name="message"
              value={formDataForm.message}
              onChange={handleChange}
              className="textarea textarea-bordered xz:textarea-sm sd:textarea-lg"
              placeholder=""
              rows={4}
            />
          </div>

          {/* Submit */}
          <div className="form-control mt-6">
            <button
              className="btn btn-primary bg-green-600 border-green-600 text-white uppercase tracking-widest"
              type="submit"
            >
              Купить
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormOrder;

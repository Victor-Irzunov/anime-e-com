// /components/FormOrder/FormOrder.jsx — ОБНОВИТЬ ПОЛНОСТЬЮ (только стили/верстка, логика без изменений)
"use client";

import { MyContext } from "@/contexts/MyContextProvider";
import { orderProduct } from "@/http/productsAPI";
import { userData } from "@/http/userAPI";
import { useContext, useEffect, useMemo, useState } from "react";
import PhoneInput from "@/components/Form/MaskPhone/PhoneInput";

const FormOrder = ({ data, setIsActive, shipping }) => {
  const { user } = useContext(MyContext);

  // ——— Обязательные всегда
  const [form, setForm] = useState({
    surname: "",
    name: "",
    patronymic: "",
    phone: "",
    email: "",
    region: "",
    district: "",
    locality: "",
    street: "",
    house: "",
    corpus: "",
    flat: "",
    comment: "",
  });

  const [tel, setTel] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [alertText, setAlertText] = useState("");

  // Показывать адрес — только для европочты/белпочты
  const needAddress = useMemo(() => {
    const m = shipping?.method;
    return m === "europost" || m === "belpost";
  }, [shipping]);

  // Префилл из профиля
  useEffect(() => {
    userData().then((ud) => {
      if (!ud) return;
      setForm((p) => ({
        ...p,
        name: ud.name || p.name,
        surname: ud.surname || p.surname,
        patronymic: ud.patronymic || p.patronymic,
        email: ud.email || p.email,
      }));
      if (ud.phone) {
        const digits = ud.phone.toString().replace(/\D/g, "");
        let d = digits.startsWith("375") ? digits : `375${digits}`;
        d = d.slice(0, 12);
        let formatted = `+375`;
        if (d.length > 3) formatted += ` ${d.slice(3, 5)}`;
        if (d.length > 5) formatted += ` ${d.slice(5, 8)}`;
        if (d.length > 8) formatted += `-${d.slice(8, 10)}`;
        if (d.length > 10) formatted += `-${d.slice(10, 12)}`;
        setTel(formatted);
      }
    });
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Валидации
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test((v || "").trim());

  const validate = () => {
    const digits = tel.replace(/\D/g, "");
    const validOperators = ["29", "33", "44", "25"];
    const operatorCode = digits.slice(3, 5);
    if (!(digits.length === 12 && digits.startsWith("375") && validOperators.includes(operatorCode))) {
      setAlertText("Введите номер вида +375 xx xxx-xx-xx (коды: 29, 33, 44, 25).");
      return false;
    }
    if (!form.surname.trim() || !form.name.trim() || !form.patronymic.trim()) {
      setAlertText("ФИО: заполните Фамилию, Имя и Отчество.");
      return false;
    }
    if (!isEmail(form.email)) {
      setAlertText("Введите корректный email.");
      return false;
    }
    if (needAddress) {
      const required = ["region", "district", "locality", "street", "house", "flat"];
      const miss = required.filter((k) => !String(form[k] || "").trim());
      if (miss.length) {
        setAlertText("Адрес доставки: заполните все поля (кроме «Корпус» и «Комментарий»).");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 3500);
      return;
    }

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

    const addressString = needAddress
      ? [
          `обл. ${form.region}`,
          `р-н ${form.district}`,
          form.locality,
          `ул. ${form.street}`,
          `д. ${form.house}`,
          form.corpus ? `корп. ${form.corpus}` : "",
          `кв. ${form.flat}`,
        ]
          .filter(Boolean)
          .join(", ")
      : "";

    const orderData = {
      userId: user?.userData?.id,
      orderItems: JSON.stringify(orderItems),
      surname: form.surname,
      name: form.name,
      patronymic: form.patronymic,
      phone: tel,
      email: form.email,
      shipping: {
        method: shipping?.method,
        format: shipping?.format,
        pickupPointId: shipping?.pickupPointId || null,
      },
      address: addressString,
      addressFields: needAddress
        ? {
            region: form.region,
            district: form.district,
            locality: form.locality,
            street: form.street,
            house: form.house,
            corpus: form.corpus,
            flat: form.flat,
          }
        : null,
      comment: form.comment || "",
    };

    const fd = new FormData();
    fd.append("orderData", JSON.stringify(orderData));

    try {
      const resp = await orderProduct(fd);
      if (resp) {
        setForm({
          surname: "",
          name: "",
          patronymic: "",
          phone: "",
          email: "",
          region: "",
          district: "",
          locality: "",
          street: "",
          house: "",
          corpus: "",
          flat: "",
          comment: "",
        });
        setTel("");
        if (typeof setIsActive === "function") setIsActive(false);
        localStorage.removeItem("cart");
      }
    } catch {
      setAlertText("Ошибка при отправке заказа. Повторите попытку.");
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 3500);
    }
  };

  return (
    <>
      {alertActive && (
        <div role="alert" className="alert alert-warning text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M4.06 20h15.88c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L2.33 17c-.77 1.33.19 3 1.73 3Z" />
          </svg>
          <span>{alertText}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full text-[14px] sd:text-[13px]">
        {/* ——— Блок 1: данные получателя ——— */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sd:p-5 mb-5">
          <h3 className="text-[18px] sd:text-[17px] font-semibold mb-3">Укажите данные получателя</h3>

          <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-gray-600">Ваша фамилия<span className="text-error">*</span></span>
              </label>
              <input
                name="surname"
                value={form.surname}
                onChange={onChange}
                type="text"
                className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Фамилия"
                required
                autoComplete="family-name"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-gray-600">Ваше имя<span className="text-error">*</span></span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                type="text"
                className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Имя"
                required
                autoComplete="given-name"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-gray-600">Ваше отчество<span className="text-error">*</span></span>
              </label>
              <input
                name="patronymic"
                value={form.patronymic}
                onChange={onChange}
                type="text"
                className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Отчество"
                required
                autoComplete="additional-name"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-gray-600">Ваш телефон<span className="text-error">*</span></span>
              </label>
              {/* PhoneInput без пропсов класса — оставляем стандарт, но контейнер подогнали по высоте */}
              <div className="input input-bordered input-sm rounded-lg px-0">
                <div className="w-full">
                  <PhoneInput
                    value={tel}
                    onChange={setTel}
                    setAlertText={setAlertText}
                    setAlertActive={setAlertActive}
                  />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-gray-600">Ваш email<span className="text-error">*</span></span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                type="email"
                className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Введите email"
                required
                autoComplete="email"
              />
            </div>
          </div>
        </section>

        {/* ——— Блок 2: адрес доставки ——— */}
        {needAddress && (
          <section className="rounded-2xl border border-gray-200 bg-white p-4 sd:p-5 mb-6">
            <h3 className="text-[18px] sd:text-[17px] font-semibold mb-3">Адрес доставки</h3>

            <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-3">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-gray-600">Область<span className="text-error">*</span></span></label>
                <input
                  name="region"
                  value={form.region}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Введите текст"
                  required
                  autoComplete="address-level1"
                />
              </div>

              <div className="flex flex-col">
                <label className="label py-1"><span className="label-text text-gray-600">Район<span className="text-error">*</span></span></label>
                <input
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Введите текст"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-gray-600">Населенный пункт<span className="text-error">*</span></span></label>
                <input
                  name="locality"
                  value={form.locality}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Введите текст"
                  required
                  autoComplete="address-level2"
                />
              </div>

              <div className="flex flex-col">
                <label className="label py-1"><span className="label-text text-gray-600">Улица<span className="text-error">*</span></span></label>
                <input
                  name="street"
                  value={form.street}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Введите текст"
                  required
                  autoComplete="street-address"
                />
              </div>

              <div className="flex flex-col">
                <label className="label py-1"><span className="label-text text-gray-600">Дом<span className="text-error">*</span></span></label>
                <input
                  name="house"
                  value={form.house}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Введите текст"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="label py-1"><span className="label-text text-gray-600">Корпус</span></label>
                <input
                  name="corpus"
                  value={form.corpus}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Введите текст"
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-gray-600">Квартира<span className="text-error">*</span></span></label>
                <input
                  name="flat"
                  value={form.flat}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Введите текст"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mt-6">
              <label className="label py-1">
                <span className="label-text text-gray-600">Комментарий к заказу</span>
                <span className="label-text-alt text-gray-400">Необязательно</span>
              </label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={onChange}
                className="textarea textarea-bordered textarea-2xl w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Оставьте пожелание или комментарий к заказу"
                rows={4}
              />
            </div>
          </section>
        )}

        {/* ——— Submit ——— */}
        <div className="form-control">
          <button
            className="btn btn-secondary btn-sm sd:btn-md rounded-lg uppercase tracking-wide"
            type="submit"
          >
            Купить
          </button>
        </div>
      </form>
    </>
  );
};

export default FormOrder;

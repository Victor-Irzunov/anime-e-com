// /components/Form/FormOrder.jsx — ОБНОВИТЬ ПОЛНОСТЬЮ (без поля пароля)
"use client";

import { MyContext } from "@/contexts/MyContextProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import PhoneInput from "@/components/Form/MaskPhone/PhoneInput";

const FormOrder = ({ data, setIsActive, shipping }) => {
  const { user } = useContext(MyContext);
  const router = useRouter();

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

  // Префилл из профиля, если авторизован
  useEffect(() => {
    async function prefill() {
      try {
        // опционально: подтянуть профиль, если есть
        const token = typeof window !== "undefined" ? localStorage.getItem("token_e_com") : null;
        if (!token) return;
        const res = await fetch(`/api/user/profile`, { cache: "no-store" });
        if (res.ok) {
          const ud = await res.json();
          if (ud) {
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
          }
        }
      } catch {}
    }
    prefill();
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
        setAlertText("Адрес доставки: заполните все обязательные поля.");
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
        ].filter(Boolean).join(", ")
      : "";

    // ——— Отправляем на гостевой чекаут (создаст гостя при необходимости, вернет токен)
    const payload = {
      email: form.email,
      surname: form.surname,
      name: form.name,
      patronymic: form.patronymic,
      phone: tel,
      address: addressString,
      addressFields: needAddress ? {
        region: form.region, district: form.district, locality: form.locality,
        street: form.street, house: form.house, corpus: form.corpus, flat: form.flat,
      } : null,
      comment: form.comment || "",
      shipping: {
        method: shipping?.method,
        format: shipping?.format,
        pickupPointId: shipping?.pickupPointId || null,
      },
      orderItems,
    };

    try {
      const res = await fetch("/api/checkout/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order failed");
      const dataResp = await res.json();

      // сохранить токен авторизации и reset-токен в LS
      if (dataResp?.token) localStorage.setItem("token_e_com", dataResp.token);
      if (dataResp?.passwordResetToken) localStorage.setItem("pwd_reset_token", dataResp.passwordResetToken);

      // очистить корзину
      localStorage.removeItem("cart");

      // закрыть форму и перейти на /thank-you
      if (typeof setIsActive === "function") setIsActive(false);
      router.push("/thank-you");
    } catch (err) {
      setAlertText("Ошибка при оформлении заказа. Повторите попытку.");
      setAlertActive(true);
      setTimeout(() => setAlertActive(false), 3500);
    }
  };

  return (
    <>
      {alertActive && (
        <div role="alert" className="alert alert-warning text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 9v2m0 4h.01M4.06 20h15.88c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L2.33 17c-.77 1.33.19 3 1.73 3Z"/>
          </svg>
          <span>{alertText}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full text-[14px] sd:text-[13px]">
        {/* ——— Блок 1: данные получателя ——— */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sd:p-5 mb-5">
          <h3 className="text-[18px] sd:text-[17px] font-semibold mb-3">Укажите данные получателя</h3>

          <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-3">
            {/* ФИО */}
            {["surname","name","patronymic"].map((k, i) => (
              <div className="form-control" key={k}>
                <label className="label py-1">
                  <span className="label-text text-gray-600">
                    {i===0?"Ваша фамилия":i===1?"Ваше имя":"Ваше отчество"}
                    <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  name={k}
                  value={form[k]}
                  onChange={onChange}
                  type="text"
                  className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder={i===0?"Фамилия":i===1?"Имя":"Отчество"}
                  required
                  autoComplete={i===0?"family-name":i===1?"given-name":"additional-name"}
                />
              </div>
            ))}

            {/* Телефон */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-gray-600">Ваш телефон<span className="text-error">*</span></span>
              </label>
              <div className="input input-bordered input-sm rounded-lg px-0">
                <div className="w-full">
                  <PhoneInput value={tel} onChange={setTel} setAlertText={setAlertText} setAlertActive={setAlertActive}/>
                </div>
              </div>
            </div>

            {/* Email */}
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
              {[
                {k:"region",lbl:"Область",req:true,ac:"address-level1"},
                {k:"district",lbl:"Район",req:true},
                {k:"locality",lbl:"Населенный пункт",req:true,ac:"address-level2"},
                {k:"street",lbl:"Улица",req:true,ac:"street-address"},
                {k:"house",lbl:"Дом",req:true},
                {k:"corpus",lbl:"Корпус",req:false},
                {k:"flat",lbl:"Квартира",req:true},
              ].map((f)=>(
                <div className="form-control" key={f.k}>
                  <label className="label py-1">
                    <span className="label-text text-gray-600">{f.lbl}{f.req?<span className="text-error">*</span>:null}</span>
                  </label>
                  <input
                    name={f.k}
                    value={form[f.k]}
                    onChange={onChange}
                    type="text"
                    className="input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Введите текст"
                    required={f.req}
                    autoComplete={f.ac||"off"}
                  />
                </div>
              ))}
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
          <button className="btn btn-secondary btn-sm sd:btn-md rounded-lg uppercase tracking-wide" type="submit">
            Купить
          </button>
        </div>
      </form>
    </>
  );
};

export default FormOrder;

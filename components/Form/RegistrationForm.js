"use client";

import { registration } from "@/http/userAPI";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiLock2Line,
  RiUserAddLine,
} from "react-icons/ri";

const RegistrationForm = ({ setIsActive, search }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActiveAlert, setIsActiveAlert] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((p) => !p);

  // простая “оценка” пароля для UX
  const strength = useMemo(() => {
    const p = formData.password || "";
    const score =
      (/[a-z]/.test(p) ? 1 : 0) +
      (/[A-Z]/.test(p) ? 1 : 0) +
      (/[0-9]/.test(p) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(p) ? 1 : 0) +
      (p.length >= 8 ? 1 : 0);
    if (!p) return { label: "", cls: "" };
    if (score <= 2) return { label: "Слабый", cls: "text-red-500" };
    if (score === 3) return { label: "Средний", cls: "text-orange-500" };
    return { label: "Сильный", cls: "text-green-600" };
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await registration(formData);
      if (data) {
        setIsActiveAlert(true);
        setFormData({ email: "", password: "" });

        setTimeout(() => {
          setIsActiveAlert(false);
          if (search === "korzina") router.push("/korzina");
          else router.push("/");
        }, 500);
      }
    } catch (err) {
      setError(
        (err && err.message) ||
          "Регистрация не удалась. Возможно, почта уже занята."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="card bg-white border border-gray-200 shadow-xl">
        <div className="card-body p-6 sd:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <RiUserAddLine className="text-primary text-xl" />
            </span>
            <div>
              <h2 className="text-xl font-semibold leading-tight">Создать аккаунт</h2>
              <p className="text-gray-500 text-sm">
                Заполните данные, чтобы зарегистрироваться.
              </p>
            </div>
          </div>

          {error ? (
            <div role="alert" className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Логин (почта)</span>
                <span className="label-text-alt text-gray-400">Обязательное поле</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <RiMailLine className="opacity-60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="grow"
                  autoComplete="email"
                  placeholder="name@example.com"
                  required
                />
              </label>
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Пароль</span>
                <span className="label-text-alt text-gray-400">Обязательное поле</span>
              </label>
              <div className="relative">
                <label className="input input-bordered flex items-center gap-2 pr-10">
                  <RiLock2Line className="opacity-60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="grow"
                    autoComplete="new-password"
                    placeholder="Минимум 8 символов"
                    required
                  />
                </label>
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {/* индикатор силы пароля */}
              {strength.label ? (
                <p className={`mt-2 text-xs ${strength.cls}`}>
                  Надёжность пароля: {strength.label}
                </p>
              ) : null}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Зарегистрироваться"
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <span className="text-gray-500">Уже есть аккаунт?</span>{" "}
            <button className="btn btn-link px-1" onClick={() => setIsActive(true)}>
              Войти
            </button>
          </div>
        </div>
      </div>

      {/* toast-успех */}
      {isActiveAlert ? (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Вы зарегистрированы!</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RegistrationForm;

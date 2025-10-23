// /app/set-password/page.jsx — СОЗДАТЬ НОВЫЙ ФАЙЛ (форма установки пароля без email-подтверждения)
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetPasswordPage() {
  const router = useRouter();
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("pwd_reset_token");
    if (!token) setErr("Не найден токен установки пароля. Оформите заказ заново.");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (pwd1.length < 6) { setErr("Пароль должен быть не менее 6 символов."); return; }
    if (pwd1 !== pwd2) { setErr("Пароли не совпадают."); return; }
    const resetToken = localStorage.getItem("pwd_reset_token");
    if (!resetToken) { setErr("Нет токена. Оформите заказ заново."); return; }
    try {
      const res = await fetch("/api/user/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password: pwd1 }),
      });
      if (!res.ok) throw new Error("Fail");
      setOk(true);
      localStorage.removeItem("pwd_reset_token");
      setTimeout(()=> router.push("/profile"), 1200);
    } catch {
      setErr("Ошибка установки пароля. Попробуйте снова.");
    }
  };

  return (
    <main className="min-h-[70vh] pt-14">
      <section className="container mx-auto max-w-md">
        <h1 className="text-3xl font-semibold">Установка пароля</h1>
        <p className="mt-2 text-sm text-gray-600">Задайте пароль для входа в профиль.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="form-control">
            <label className="label py-1"><span className="label-text">Пароль</span></label>
            <input type="password" className="input input-bordered w-full" value={pwd1} onChange={(e)=>setPwd1(e.target.value)} />
          </div>
          <div className="form-control">
            <label className="label py-1"><span className="label-text">Повтор пароля</span></label>
            <input type="password" className="input input-bordered w-full" value={pwd2} onChange={(e)=>setPwd2(e.target.value)} />
          </div>
          {err ? <div className="alert alert-warning text-sm">{err}</div> : null}
          {ok ? <div className="alert alert-success text-sm">Пароль сохранён. Перенаправляем…</div> : null}
          <button className="btn btn-secondary" type="submit">Сохранить пароль</button>
        </form>
      </section>
    </main>
  );
}

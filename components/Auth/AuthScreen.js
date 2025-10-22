// components/Auth/AuthScreen.jsx
"use client";

import { useState } from "react";
import LoginForm from "@/components/Form/FormLogin";
import RegistrationForm from "@/components/Form/RegistrationForm";

export default function AuthScreen({ search }) {
  const [isActive, setIsActive] = useState(true);

  return (
    <section className="min-h-screen py-32 relative">
      <div className="container mx-auto">
        {isActive ? (
          <div>
            <h1 className="text-2xl">Войти</h1>
            <LoginForm setIsActive={setIsActive} search={search} />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl">Зарегистрироваться</h1>
            <RegistrationForm setIsActive={setIsActive} search={search} />
          </div>
        )}
      </div>
    </section>
  );
}

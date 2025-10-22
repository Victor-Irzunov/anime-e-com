// /app/(admin)/layout.jsx — ДОБАВЬ GlobalToast (можно и в /app/layout.jsx)
"use client";
import GlobalToast from "@/components/ui/GlobalToast";

export default function AdminLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <GlobalToast />
        {children}
      </body>
    </html>
  );
}

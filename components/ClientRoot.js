// /components/ClientRoot.jsx
"use client";

import GlobalToast from "@/components/ui/GlobalToast";

export default function ClientRoot({ children }) {
  return (
    <>
      <GlobalToast /> {/* глобальные тосты */}
      {children}
    </>
  );
}

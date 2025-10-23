// /components/Form/OrderFormComp.jsx — ОБНОВИТЬ ПОЛНОСТЬЮ
"use client";
import { forwardRef } from "react";
import FormOrder from "./FormOrder";

const OrderFormComp = forwardRef((props, ref) => {
  const { data, setIsActive, shipping } = props;
  return (
    <div ref={ref} className="rounded-lg border border-gray-300 p-4 bg-white flex flex-col gap-3 mb-32">
      <FormOrder data={data} setIsActive={setIsActive} shipping={shipping} />
    </div>
  );
});
OrderFormComp.displayName = "OrderFormComp";
export default OrderFormComp;

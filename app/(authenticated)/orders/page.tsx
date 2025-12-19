"use client";

import { useEffect, useTransition } from "react";
import { orderByUser } from "@/services/orderService";

export default function Page() {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const orders = await orderByUser();
      console.log(orders);
    });
  }, []);
  return (
    <div>
      <h1>Orders</h1>
    </div>
  );
}

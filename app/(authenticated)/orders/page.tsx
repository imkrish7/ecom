"use client";

import { useEffect, useTransition, useState } from "react";
import { orderByUser } from "@/services/orderService";
import { Order } from "@/types/orders";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { OrderCard } from "@/components/OrderCard";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await orderByUser<{ orders: Order[] }>();

        setOrders(response.orders);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch orders");
      }
    });
  }, []);
  return (
    <div className="p-4 flex flex-col gap-4">
      {isPending ? (
        <Spinner />
      ) : orders.length > 0 ? (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      ) : (
        <div>No orders found</div>
      )}
    </div>
  );
}

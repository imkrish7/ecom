"use client";
import { fetchCart } from "@/services/productService";
import { useEffect, useTransition, useState } from "react";
import { Product } from "@/types/products";
import { ProductCard } from "@/components/ProductCard";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [cart, setCart] = useState<Product[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      try {
        const _cart = await fetchCart<Product[]>();
        setCart(_cart);
        setOrder([..._cart.filter((e) => !!e.selected).map((e) => e.id)]);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    });
  }, []);

  const addOrder = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setOrder((prev) => [...prev, id]);
      setCart((prev) => {
        return prev.map((e) => {
          if (e.id === id) {
            e.selected = true;
          }
          return e;
        });
      });
    } else {
      setOrder((prev) => prev.filter((e) => e !== id));
      setCart((prev) => {
        return prev.map((e) => {
          if (e.id === id) {
            e.selected = false;
          }
          return e;
        });
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4 p-4">
      <div className="w-full flex flex-1 gap-4">
        {isPending ? (
          <Spinner />
        ) : cart.length > 0 ? (
          <>
            {cart.map((product: Product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCart={true}
                  addToOrder={addOrder}
                />
              );
            })}
          </>
        ) : (
          <p>Cart is empty</p>
        )}
      </div>
      {order.length > 0 && (
        <div className="flex w-full justify-end">
          <Button onClick={() => router.push("/checkout")}>Checkout</Button>
        </div>
      )}
    </div>
  );
}

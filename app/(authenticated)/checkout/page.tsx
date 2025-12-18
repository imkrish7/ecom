"use client";
import { CardDetail } from "@/components/CardInput";
import { CouponCard } from "@/components/Coupon";
import { ProductCard } from "@/components/ProductCard";
import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  applyDiscount,
  getOrderTotal,
  processPayment,
} from "@/services/productService";
import { AppliedDiscount, OrderTotal } from "@/types/orders";
import { Product } from "@/types/products";
import { useEffect, useTransition, useState, startTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cardDetailsSchema } from "@/schema/order.schema";
import { z } from "zod";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isPending, _startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [discountedTotal, setDiscountedTotal] = useState<number>(0);
  const [discountOnTotal, setDiscountOnTotal] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    _startTransition(async () => {
      try {
        const response = await getOrderTotal<OrderTotal>();
        setProducts(response?.products);
        setTotal(response.total);
      } catch (error) {
        toast.error("Failed to fetch order items");
      }
    });
  }, []);

  const applyCoupon = (coupon: string) => {
    startTransition(async () => {
      try {
        const response = await applyDiscount<AppliedDiscount>(coupon, total);
        setDiscountOnTotal(response.discountOnTotal);
        setDiscountedTotal(response.discountedTotal);
        setTotal(response.total);
        setCouponCode(coupon);
      } catch (error) {
        toast.error("Failed to apply coupon");
      }
    });
  };

  const handleSubmit = (payment: z.infer<typeof cardDetailsSchema>) => {
    // Handle form submission logic here
    console.log(payment);
    startTransition(async () => {
      try {
        const items = products.map((product) => ({
          productId: product.id,
          quantity: product.quantity!,
        }));
        console.log(items);
        await processPayment({
          ...payment,
          totalAmount: total,
          couponCode,
          items,
        });
        router.push(`/dashboard`);
        toast.success("Order created successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to create order");
      }
    });
  };

  return (
    <div className="grid grid-cols-2 p-4">
      <div className="flex flex-col">
        {isPending ? (
          <Spinner />
        ) : (
          products.length > 0 &&
          products.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                isCart={false}
                isOrder={false}
              />
            );
          })
        )}
      </div>
      <div className="flex flex-col gap-2">
        <CouponCard applyCoupon={applyCoupon} discount={couponCode} />
        <Card className="flex flex-col">
          <CardHeader>{/*<CardTitle>Total</CardTitle>*/}</CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {discountOnTotal > 0 && (
              <div className="flex gap-4 mb-3">
                <span className="font-bold">Discount:</span>
                <span>${discountOnTotal}</span>
              </div>
            )}
            {discountedTotal > 0 && (
              <div className="flex gap-4 mb-3">
                <span className="font-bold">Total:</span>
                <span>${total}</span>
              </div>
            )}
            <div className="flex gap-4 mb-3">
              <span className="font-bold">Grand Total:</span>
              <span>${discountedTotal ? discountedTotal : total}</span>
            </div>
            <CardDetail handlePayment={handleSubmit} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllAvailableCoupon } from "@/services/productService";
import { Coupon } from "@/types/orders";
import { useTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import {
  Item,
  ItemDescription,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "./ui/item";
import { Button } from "./ui/button";

interface CouponCardProps {
  applyCoupon: (coupon: string) => void;
  discount: string;
}

export const CouponCard = ({ applyCoupon, discount }: CouponCardProps) => {
  const [isPending, startTransition] = useTransition();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getAllAvailableCoupon<Coupon[]>();
        setCoupons(response);
      } catch (error) {
        toast.error("Failed to fetch coupon");
      }
    });
  }, []);
  return (
    <Card className={"flex-1"}>
      <CardHeader>
        <CardTitle>Coupon</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Spinner />
        ) : coupons.length > 0 ? (
          coupons.map((coupon) => {
            return (
              <Item key={coupon.id}>
                <ItemContent>
                  <ItemTitle>{coupon.code}</ItemTitle>
                  <ItemDescription>
                    Discount on total amount would be
                    {coupon.discount}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    onClick={() => applyCoupon(coupon.code)}
                    variant={discount.length > 0 ? "default" : "outline"}
                    size="sm"
                  >
                    Apply
                  </Button>
                </ItemActions>
              </Item>
            );
          })
        ) : (
          <span>No coupon available</span>
        )}
      </CardContent>
    </Card>
  );
};

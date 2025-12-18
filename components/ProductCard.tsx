import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Product } from "@/types/products";
import { Button } from "./ui/button";
import { Loader2Icon, ShoppingCartIcon } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  addToCart,
  removeFromCart,
  selectToOrder,
} from "@/services/productService";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { refresh } from "next/cache";

export const ProductCard = ({
  product,
  isCart,
  addToOrder,
  isOrder,
}: {
  product: Product;
  isCart: boolean;
  isOrder?: boolean;
  addToOrder?: (id: string, isSelected: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(product.id, 1);
        toast.success("Product added to cart");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to add product to cart");
        }
      }
    });
  };

  const handleRemoveFromCart = () => {
    // Implement the logic to remove the product from the cart
    startTransition(async () => {
      try {
        if (!product.cartItemId) {
          toast.error("Product is not in cart");
          return;
        }
        await removeFromCart(product.cartItemId);
        refresh();
        toast.success("Product removed from cart");
      } catch (error) {
        if (error instanceof Error) {
          console.dir(error);
          toast.error(error.message);
        } else {
          toast.error("Failed to remove product from cart");
        }
      }
    });
  };

  const addToOrderItem = (val: string | boolean) => {
    startTransition(async () => {
      try {
        await selectToOrder(product.id, Boolean(val));
        addToOrder?.(product.id, Boolean(val));
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Card className="flex flex-col max-w-75">
      <CardHeader>
        {isCart && (
          <Checkbox
            checked={product.selected}
            onCheckedChange={addToOrderItem}
          />
        )}
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mt-2">
            {product.description}
          </span>
          <span className="text-md font-semibold mt-2">${product.price}</span>
        </div>
      </CardContent>
      <CardFooter>
        {isCart ? (
          <Button onClick={handleRemoveFromCart} variant={"destructive"}>
            {isPending && (
              <Loader2Icon
                role="status"
                aria-label="Loading"
                className={cn("size-4 animate-spin mr-3")}
              />
            )}
            <ShoppingCartIcon className="size-4 mr-2" />
            Remove from Cart
          </Button>
        ) : (
          isOrder && (
            <Button onClick={handleAddToCart}>
              {isPending && (
                <Loader2Icon
                  role="status"
                  aria-label="Loading"
                  className={cn("size-4 animate-spin mr-3")}
                />
              )}
              <ShoppingCartIcon className="size-4 mr-2" />
              Add to Cart
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};

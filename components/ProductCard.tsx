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
import { ShoppingCartIcon } from "lucide-react";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
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
          {/*<span className="text-md font-semibold">{product.name}</span>*/}
          <span className="text-sm text-gray-500 mt-2">
            {product.description}
          </span>
          <span className="text-md font-semibold mt-2">${product.price}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <ShoppingCartIcon className="size-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

"use client";
import { ProductCard } from "@/components/ProductCard";
import { Spinner } from "@/components/ui/spinner";
import { fetchProducts } from "@/services/productService";
import { Product } from "@/types/products";
import { useEffect, useTransition, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    startTransition(async () => {
      try {
        const _products = await fetchProducts<Product[]>();
        console.log(_products);
        setProducts(_products);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      }
    });
  }, []);
  return (
    <div className="flex gap-4 mt-4 p-4">
      {isPending ? (
        <Spinner />
      ) : products.length > 0 ? (
        <>
          {products.map((product: Product) => {
            return (
              <ProductCard key={product.id} product={product} isCart={false} />
            );
          })}
        </>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}

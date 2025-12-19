import { OrderItem } from "@/types/orders";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import Image from "next/image";

export const OrderItemRow = ({ orderItem }: { orderItem: OrderItem }) => {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline" asChild role="listitem">
        <a href="#">
          <ItemMedia variant="image">
            <Image
              src={orderItem.product.imageUrl}
              alt={orderItem.product.name}
              width={100}
              height={100}
              className="object-cover grayscale"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">
              {orderItem.product.name} -{" "}
              <span className="text-muted-foreground">
                {orderItem.product.description}
              </span>
            </ItemTitle>
          </ItemContent>
        </a>
      </Item>
    </div>
  );
};

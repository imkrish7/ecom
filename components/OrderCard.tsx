import { Order } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { OrderItemRow } from "./OrderItemRow";
import { OrderItem } from "@/types/orders";
export const OrderCard = ({ order }: { order: Order }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order# {order.id}</CardTitle>
        <CardTitle>
          Date:{new Date(order.createdAt).toLocaleDateString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {order.orderItems.map((orderItem: OrderItem) => (
          <OrderItemRow key={orderItem.id} orderItem={orderItem} />
        ))}
      </CardContent>
    </Card>
  );
};

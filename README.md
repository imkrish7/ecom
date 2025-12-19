

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Accessible at `http://localhost:3000/login`

# Pages
## Shared
1. `/signin`
2. `/signup`
## User
1. `/dashboard`
2. `/orders`
3. `/cart`
4. `/checkout`
## Admin
1. `/admin/dashboard`


# API

## `/api/auth/login` (method: POST)
requirments
```
{
  email: tring().email(),
  password: string().min(8).max(100),
}
```
## `/api/auth/signup` (method: POST)
requirements
```
{
  email: string().email(),
  password: string().min(8).max(100),
  name: string().min(2).max(100),
}
```
## You can use the `/api/orders` endpoint to retrieve order data specific to the user. (method: GET)
Response
```
  Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  cartItemId?: string;
  quantity?: number;
  selected?: boolean;
  updatedAt: string;
  createdAt: string;
}[]
```
## To retrieve the order total, use the `/api/orders/prices` endpoint.(method: GET)
```
{
  products: Product[];
  total: number;
}
```
## To obtain a coupon for the user, use the endpoint `/api/orders/discounts`. (method: GET)
```
Coupon {
  code: string;
  discount: number;
  id: string;
  orderRequirements: number;
  updatedAt: string;
  createdAt: string;
}[]
```
## To apply a coupon for the user, use the endpoint `/api/orders/discounts`. (method: POST)
requirments
```
{
  code: string().min(3).max(10),
  discount: number().min(0).max(100),
  orderRequirements: number().min(0).max(1000),
}
```
## `/api/orders/checkout` (method: POST)
requirments
```
{
  items: [
    {
      productId: string().uuid(),
      quantity: number().min(1).max(100),
    },
  ],
  totalAmount: number().min(0),
  cardNumber: string().min(16).max(16),
  cardExpiration: string().min(5).max(7),
  cvv: string().min(3).max(4),
  couponCode: string().min(5).optional(),
}
```
## `/api/orders/cart` (method: POST) to add a product in cart
requirements
```
item: {
    productId: string().uuid(),
    quantity: number().min(1).max(100),
  }
```

## Use the `/api/orders/cart` endpoint with the GET method to retrieve items in the cart.
Response
```
Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  cartItemId?: string;
  quantity?: number;
  selected?: boolean;
  updatedAt: string;
  createdAt: string;
}[]
```
## Use the `/api/orders/cart/[id]` endpoint with the POST method to select an item for the order.
requirments
`
{
isSelected: boolean
}
`
## Use the `/api/orders/cart/[id]` endpoint with the DELETE method to delete an item from the cart.
## Use the `/api/admin/stats` endpoint with the GET method to get order stats.
Response
```
Discount {
  code: string;
  discount: number;
  discountAmount: number;
}

DashboardStats {
  itemsPurchased: number;
  purchaseAmount: number;
  discounts: Discount[];
}

```
## Use the `/api/admin/coupon` endpoint with the POST method to create a coupon.
requirments
```
{
  code: string().min(3).max(10),
  discount: number().min(0).max(100),
  orderRequirements: number().min(0).max(1000),
}
```
## Use the `/api/user/me` endpoint with the GET method to get user info.
Response 
```
 User {
  name: string;
  email: string;
  role: string;
}
```



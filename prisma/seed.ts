import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashPassword } from "@/lib/passwordUtils";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear DB
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const hashedPassword = await hashPassword("abc@123A");
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Test User",
      password: hashedPassword,
      role: "user",
      completedOrderCount: 1,
    },
  });

  // ---------- PRODUCTS ----------
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Laptop",
        price: 1000,
        description:
          "High performance laptop suitable for development and gaming.",
        imageUrl: "https://picsum.photos/seed/laptop/600/400",
      },
      {
        name: "Mouse",
        price: 50,
        description: "Wireless ergonomic mouse.",
        imageUrl: "https://picsum.photos/seed/mouse/600/400",
      },
      {
        name: "Keyboard",
        price: 120,
        description: "Mechanical keyboard with backlight.",
        imageUrl: "https://picsum.photos/seed/keyboard/600/400",
      },
    ],
  });

  const allProducts = await prisma.product.findMany();

  // ---------- CART ----------
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });

  // ---------- CART ITEMS ----------
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart.id,
        productId: allProducts[0].id,
        quantity: 1,
        selected: true,
      },
      {
        cartId: cart.id,
        productId: allProducts[1].id,
        quantity: 2,
        selected: false,
      },
    ],
  });

  // ---------- COUPON ----------
  const coupon = await prisma.coupon.create({
    data: {
      code: "EVERY3RD10",
      orderRequirements: 3,
      discount: 10,
    },
  });

  // ---------- ORDER ----------
  const subtotal = 1000 + 2 * 50;
  const discountAmount = 100;
  const totalAmount = subtotal - discountAmount;

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "COMPLETED",
      completed: true,
      couponCode: coupon.code,
      discountAmount,
      totalAmount,
      orderItems: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 1,
          },
          {
            productId: allProducts[1].id,
            quantity: 2,
          },
        ],
      },
    },
  });

  // ---------- PAYMENT ----------
  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: "SUCCESS",
      amount: totalAmount,
      intent: "card_payment",
      cardNumber: "4111111111111111",
    },
  });

  // ---------- UPDATE USER ----------
  await prisma.user.update({
    where: { id: user.id },
    data: {
      completedOrderCount: {
        increment: 1,
      },
      discountUsed: true,
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

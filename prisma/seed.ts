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
      email: "test@example.com",
      name: "Test User",
      role: "user",
      password: hashedPassword,
      completedOrderCount: 2,
    },
  });

  // Products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Laptop",
        description:
          "A high-performance laptop suitable for software development, gaming, and everyday productivity. Comes with fast SSD storage and a powerful processor.",
        price: 1000,
        imageUrl: "https://picsum.photos/seed/laptop/600/400",
      },
      {
        name: "Mouse",
        description:
          "Wireless ergonomic mouse designed for long working hours. Provides precision tracking and a comfortable grip.",
        price: 50,
        imageUrl: "https://picsum.photos/seed/mouse/600/400",
      },
      {
        name: "Keyboard",
        description:
          "Mechanical keyboard with tactile switches and customizable backlighting. Ideal for programmers and gamers.",
        price: 120,
        imageUrl: "https://picsum.photos/seed/keyboard/600/400",
      },
    ],
  });

  const allProducts = await prisma.product.findMany();

  // Cart
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });

  // Cart Items
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart.id,
        productId: allProducts[0].id,
        quantity: 1,
      },
      {
        cartId: cart.id,
        productId: allProducts[1].id,
        quantity: 2,
      },
    ],
  });

  // Coupon (every 3rd order logic)
  await prisma.coupon.create({
    data: {
      code: "EVERY3RD10",
      orderRequirements: 1,
      discount: 10,
    },
  });

  // Order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "COMPLETED",
      completed: true,
      totalAmount: 1100,
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

  // Payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: "SUCCESS",
      amount: 1100,
      intent: "card_payment",
      cardNumber: "4242424242424242",
    },
  });

  // Update order count
  await prisma.user.update({
    where: { id: user.id },
    data: {
      completedOrderCount: { increment: 1 },
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

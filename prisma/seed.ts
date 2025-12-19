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
      name: "Regular User",
      role: "user",
      password: hashedPassword,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      password: hashedPassword,
    },
  });

  // --------- CARTS ----------
  const userCart = await prisma.cart.create({
    data: { userId: user.id },
  });

  const adminCart = await prisma.cart.create({
    data: { userId: admin.id },
  });

  // --------- PRODUCTS ----------
  await prisma.product.createMany({
    data: [
      {
        name: "Laptop",
        price: 1000,
        description: "High performance laptop",
        imageUrl: "https://picsum.photos/seed/laptop/600/400",
      },
      {
        name: "Mouse",
        price: 50,
        description: "Wireless ergonomic mouse",
        imageUrl: "https://picsum.photos/seed/mouse/600/400",
      },
      {
        name: "Keyboard",
        price: 120,
        description: "Mechanical keyboard",
        imageUrl: "https://picsum.photos/seed/keyboard/600/400",
      },
    ],
  });

  const products = await prisma.product.findMany();

  // --------- CART ITEMS ----------
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: userCart.id,
        productId: products[0].id,
        quantity: 1,
        selected: true,
      },
      {
        cartId: userCart.id,
        productId: products[1].id,
        quantity: 2,
        selected: false,
      },
      {
        cartId: adminCart.id,
        productId: products[2].id,
        quantity: 1,
        selected: true,
      },
    ],
  });

  // --------- COUPON ----------
  const coupon = await prisma.coupon.create({
    data: {
      code: "EVERY3RD10",
      orderRequirements: 3,
      discount: 10,
    },
  });

  // --------- ORDER (for user only) ----------
  const subtotal = 1000;
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
            productId: products[0].id,
            quantity: 1,
          },
        ],
      },
    },
  });

  // --------- PAYMENT ----------
  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: "SUCCESS",
      amount: totalAmount,
      intent: "card_payment",
      cardNumber: "4111111111111111",
    },
  });

  // --------- UPDATE USER ----------
  await prisma.user.update({
    where: { id: user.id },
    data: {
      completedOrderCount: { increment: 1 },
      discountUsed: true,
    },
  });

  console.log("✅ Database seeded with user & admin");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Fetching users...");
    const users = await prisma.users.findMany();
    console.log("Users:", users);

    console.log("Fetching orders...");
    const orders = await prisma.orders.findMany({
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
    });
    console.log("Orders:", orders);
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

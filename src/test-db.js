import prisma from "./config/prisma.js";

async function testDatabaseConnection() {
    try {
    await prisma.$connect();

    console.log("Successfully connected to TiDB!");

    const result = await prisma.$queryRaw`SELECT 1 AS connection_test`;

    console.log(result);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  log: ["query"],
});

export default prismaClient; // now we can run querys to database using this prismaClient

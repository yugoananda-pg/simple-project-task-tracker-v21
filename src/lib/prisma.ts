import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  cachedUrl: string | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

if (
  !globalForPrisma.prisma ||
  globalForPrisma.cachedUrl !== process.env.DATABASE_URL
) {
  globalForPrisma.prisma = createPrismaClient();
  globalForPrisma.cachedUrl = process.env.DATABASE_URL;
}

export const prisma = globalForPrisma.prisma;


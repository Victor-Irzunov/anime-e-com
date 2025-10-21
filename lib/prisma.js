// /lib/prisma.js
import { PrismaClient } from "@prisma/client";

// В DEV держим один инстанс в globalThis, чтобы HMR не плодил подключения.
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalThis.__PRISMA__) {
    globalThis.__PRISMA__ = new PrismaClient();
  }
  prisma = globalThis.__PRISMA__;
}

export default prisma;

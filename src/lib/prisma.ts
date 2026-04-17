import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required for connection pooling in Node environments (like Vercel functions)
// @ts-ignore
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// Vercel provides 'POSTGRES_PRISMA_URL' for pooled connections
const connectionString = process.env.POSTGRES_PRISMA_URL;

const adapter = new PrismaNeon({ connectionString: connectionString as string });

export const prisma = new PrismaClient({ adapter });

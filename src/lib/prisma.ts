import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Standard fix for Node.js environments
neonConfig.webSocketConstructor = ws;

// Instead of creating a 'new Pool' manually, let PrismaNeon handle it
const adapter = new PrismaNeon(new Pool({ connectionString: process.env.DATABASE_URL }) as any );

export const prisma = new PrismaClient({ adapter });

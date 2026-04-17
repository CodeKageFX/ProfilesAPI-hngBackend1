"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_neon_1 = require("@prisma/adapter-neon");
const serverless_1 = require("@neondatabase/serverless");
const ws_1 = __importDefault(require("ws"));
// Required for Neon's serverless driver to work in standard Node.js environments
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
// 1. Create the connection pool using the pooled URL
const pool = new serverless_1.Pool({ connectionString: process.env.DATABASE_URL });
// 2. Initialize the adapter with the pool
const adapter = new adapter_neon_1.PrismaNeon(pool);
// 3. Instantiate Prisma Client with the adapter
const prisma = new client_1.PrismaClient({ adapter });
exports.prisma = prisma;

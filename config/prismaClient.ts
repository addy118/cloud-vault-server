import { config } from "dotenv";
config({ path: "../.env" });
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
export default db;


import path from "path";
import { config } from "dotenv";
config({ path: "../.env" });
import { PrismaClient } from "@prisma/client";

// const { DATABASE_URL } = process.env;
// console.log(DATABASE_URL);
const db = new PrismaClient();
export default db;

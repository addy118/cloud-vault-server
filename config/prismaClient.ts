import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { PrismaClient } from "@prisma/client";

// const { DATABASE_URL } = process.env;
// console.log(DATABASE_URL);
const db = new PrismaClient();
export default db;


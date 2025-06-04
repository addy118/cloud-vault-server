import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import db from "../config/prismaClient";
import User from "./User";
import Folder from "./Folder";

const main = async () => {
  const res = await Folder.getRoot(10);

  console.log(res);
};

main();

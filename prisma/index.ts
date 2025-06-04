import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import db from "../config/prismaClient";
import User from "./queries/User";
import Folder from "./queries/Folder";

const main = async () => {
  const res = await Folder.getRoot(10);

  console.log(res);
};

main();

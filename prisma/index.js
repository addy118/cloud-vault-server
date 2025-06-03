const db = require("../config/prismaClient");
const Folder = require("./queries/Folder");

const main = async () => {
  const res = await db.user.findFirst(1);
  console.log(res);
};

main();

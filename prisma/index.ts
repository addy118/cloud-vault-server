// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'db'.
const db = require("../config/prismaClient");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Folder'.
const Folder = require("./queries/Folder");

// @ts-expect-error TS(2697): An async function or method must return a 'Promise... Remove this comment to see the full error message
const main = async () => {
  const res = await db.user.findFirst(1);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(res);
};

main();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Router'.
const { Router } = require("express");
const {
  verifyToken,
  verifyOwnership,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require("../controllers/authController");
const {
  getUser,
  putUserName,
  putUserEmail,
  putUserPass,
  delUser,
  testProtected,
  getUserInfo,
  putUserUserName,
  putUserPhone,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require("../controllers/userController");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateRe... Remove this comment to see the full error message
const { validateReq } = require("../config/validation/req");
const {
  validateName,
  validateEmail,
  validatePass,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require("../config/validation/user");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userRouter... Remove this comment to see the full error message
const userRouter = Router();

userRouter.get("/:userId", getUser);

// protect the routes
userRouter.use("/:userId/*", [verifyToken, verifyOwnership]);

userRouter.post("/:userId/protected", testProtected);

userRouter.get("/:userId/info", getUserInfo);

userRouter.put("/:userId/name", [validateName, validateReq, putUserName]);
userRouter.put("/:userId/username", [validateReq, putUserUserName]);
// userRouter.put("/:userId/phone", [validateReq, putUserPhone]);
userRouter.put("/:userId/email", [validateEmail, validateReq, putUserEmail]);
userRouter.put("/:userId/password", [validatePass, validateReq, putUserPass]);

userRouter.delete("/:userId", delUser);

userRouter.use((err: any, req: any, res: any, next: any) => {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err.message);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err.stack);
  res.send("Something broke in user routes!");
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = userRouter;

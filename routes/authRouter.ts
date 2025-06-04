// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Router'.
const { Router } = require("express");
const {
  postSignup,
  postLogin,
  getToken,
  refresh,
  postLogout,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require("../controllers/authController");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateRe... Remove this comment to see the full error message
const { validateReq } = require("../config/validation/req");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { validateSignup, validateLogin } = require("../config/validation/user");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authRouter... Remove this comment to see the full error message
const authRouter = Router();

authRouter.get("/token", getToken);
authRouter.get("/refresh", refresh);

authRouter.post("/signup", [validateSignup, validateReq, postSignup]);

authRouter.post("/login", [validateLogin, validateReq, postLogin]);
authRouter.post("/logout", postLogout);

authRouter.use((err: any, req: any, res: any, next: any) => {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err.message);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err.stack);
  res.send("Something broke in auth routes!");
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = authRouter;

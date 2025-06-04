import { NextFunction, Request, Response, Router } from "express";
import {
  postSignup,
  postLogin,
  getToken,
  refresh,
  postLogout,
} from "../controllers/authController";
import { validateReq } from "../config/validation/req";
import { validateSignup, validateLogin } from "../config/validation/user";
const authRouter = Router();

authRouter.get("/token", getToken);
authRouter.get("/refresh", refresh);

authRouter.post("/signup", [...validateSignup, validateReq, postSignup]);
authRouter.post("/login", [...validateLogin, validateReq, postLogin]);
authRouter.post("/logout", postLogout);

authRouter.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    console.error(err.stack);
    res.send("Something broke in auth routes!");
  },
);

export default authRouter;

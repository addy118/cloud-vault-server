import { Router } from "express";
// import { verifyToken, verifyOwnership } from "../controllers/authController";
import {
  getUser,
  putUserName,
  putUserEmail,
  testProtected,
  getUserInfo,
  putUserUserName,
} from "../controllers/userController";
import { validateReq } from "../config/validation/req";
import {
  validateName,
  validateEmail,
  validatePass,
} from "../config/validation/user";
const userRouter = Router();

userRouter.get("/:userId", getUser);

// userRouter.use("/:userId/*", verifyToken, verifyOwnership);

userRouter.post("/:userId/protected", testProtected);

userRouter.get("/:userId/info", getUserInfo);

userRouter.put("/:userId/name", [...validateName, validateReq, putUserName]);
userRouter.put("/:userId/username", [validateReq, putUserUserName]);
userRouter.put("/:userId/email", [...validateEmail, validateReq, putUserEmail]);
// userRouter.put("/:userId/password", [
//   ...validatePass,
//   validateReq,
//   putUserPass,
// ]);

// userRouter.delete("/:userId", delUser);

userRouter.use((err: any, req: any, res: any, next: any) => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in user routes!");
});

export default userRouter;

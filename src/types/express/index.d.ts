import { JwtPayload } from "jsonwebtoken";
import { AuthUser } from "../user.types";

declare namespace Express {
  interface Request {
    user?: AuthUser | JwtPayload;
  }
}

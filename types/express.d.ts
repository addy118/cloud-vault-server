import { JwtPayload } from "jsonwebtoken";
import { AuthUser } from "prisma/queries/user.types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser | JwtPayload;
    }
  }
}

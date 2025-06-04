import { config } from "dotenv";
config({ path: "../.env" });
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../prisma/queries/User";
import Folder from "../prisma/queries/Folder";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { RootUser } from "prisma/queries/user.types";
import {
  AuthRequest,
  LoginRes,
  MsgBody,
  MsgRes,
  SignupRes,
  TokenRes,
  Tokens,
  UserWithTokenRes,
} from "./controller.types";
const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;
const isProd = false;

export const postSignup = async (req: Request, res: Response): SignupRes => {
  const { name, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(name, username, email, hashedPassword);
    if (!user) throw new Error("Error creating user.");

    const root = await Folder.createRoot(Number(user.id));
    if (!root) throw new Error("Error creating a root folder.");

    res.status(200).json({ ...user, rootId: root.id });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({
        msg: "Email, Phone or Username already exists. Please choose a different one.",
      });
    }

    if (error instanceof Error) {
      console.error("Error during signup: ", error.stack);
      res.status(500).json({ msg: "Failed to create user. Please try again." });
    }
  }
};

export const postLogin = async (req: Request, res: Response): LoginRes => {
  const { data, password } = req.body;

  try {
    const user = await User.get(data);
    if (!user) throw new Error("User not found!");

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new Error("Invalid password!");

    const root = await Folder.getRootId(user.id);
    if (!root) throw new Error("Error retrieving a root folder.");

    const { accessToken, refreshToken } = generateTokens({
      ...user,
      rootId: root.id,
    });

    // set the refreshCookie on client's browser using Set-Cookie
    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    if (!ACCESS_TOKEN)
      throw new Error("Couldn't load ACCESS_TOKEN from .env file.");
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);

    return res.json({ msg: "Login Successful!", accessToken, user: decoded });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during login: ", error.stack);
      res.status(500).json({ msg: "Login failed. Please try again." });
    }
  }
};

export const postLogout = async (req: Request, res: Response): MsgRes => {
  try {
    // remove the cookie from client's browser
    res.clearCookie("refreshCookie", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during logout: ", error.stack);
      return res.status(500).json({ msg: "Logout failed. Please try again." });
    }
  }
};

export const getToken = async (
  req: Request,
  res: Response,
): UserWithTokenRes => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken) throw new Error("Invalid access token.");

  try {
    if (!ACCESS_TOKEN)
      throw new Error("Couldn't load ACCESS_TOKEN from .env file.");
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);

    return res.json({ accessToken, user: decoded });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error verifying token: ", err.stack);
      res.status(403).json({ msg: "Invalid or expired token" });
    }
  }
};

// attach user obj to req obj
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response<string> | undefined => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader && bearerHeader.split(" ")[1];
  if (!accessToken) return res.status(500).send("Unauthorized access!");

  try {
    if (!ACCESS_TOKEN)
      throw new Error("Couldn't load ACCESS_TOKEN from .env file.");
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);
    if (typeof decoded == "string") throw new Error("Invalid access token.");

    console.log("Decoded user: ", decoded);
    req.user = decoded;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error verifying access token: ", err.stack);
      return res.status(403).json({ msg: "Invalid or expired token" });
    }
  }
};

export const refresh = async (req: Request, res: Response): TokenRes => {
  const refreshCookie = req.cookies.refreshCookie;
  if (!refreshCookie) throw new Error("Unauthorized: No Token Found");

  try {
    if (!REFRESH_TOKEN)
      throw new Error("Couldn't load REFRESH_TOKEN from .env file.");
    const decoded = jwt.verify(refreshCookie, REFRESH_TOKEN);

    if (typeof decoded == "string") throw new Error("Invalid token.");
    const user = await User.getById(decoded.id);

    if (!user) throw new Error("User not found");
    const root = await Folder.getRootId(user.id);

    if (!root) throw new Error("Folder not found.");
    const { accessToken, refreshToken } = generateTokens({
      ...user,
      rootId: root.id,
    });

    // send new refreshCookie to client for setting on browser
    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    // send accessToken in response
    return res.json({ msg: "Tokens Regenerated", accessToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error refreshing token: ", error.stack);
      return res.status(403).json({ msg: "Invalid or expired refresh token" });
    }
  }
};

export const verifyOwnership = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response<MsgBody> | undefined => {
  const userId = Number(req.params.userId);

  if (userId !== req.user.id) {
    return res.status(403).json({ msg: "You don't have access rights" });
  }
  next();
};

const generateTokens = (user: RootUser): Tokens => {
  if (!ACCESS_TOKEN)
    throw new Error("Couldn't load ACCESS_TOKEN from .env file.");
  const accessToken = jwt.sign(
    {
      id: user.id,
      rootId: user.rootId,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
    ACCESS_TOKEN,
    { expiresIn: "10m" },
  );

  if (!REFRESH_TOKEN)
    throw new Error("Couldn't load REFRESH_TOKEN from .env file.");
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};

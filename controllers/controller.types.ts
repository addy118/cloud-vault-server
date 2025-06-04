import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { CompleteFolder } from "prisma/queries/folder.types";
import {
  AuthUser,
  BaseUser,
  CompleteUser,
  RootUser,
  UserDB,
} from "prisma/queries/user.types";

export interface MsgBody {
  msg: string;
}

export interface TokenBody extends MsgBody {
  accessToken: string;
}

export type MsgRes = Promise<Response<MsgBody> | undefined>;
export type TokenRes = Promise<Response<TokenBody> | undefined>;
export type UserWithTokenRes = Promise<Response<UserWithTokenBody> | undefined>;

export interface FileCore {
  name: string;
  userId: number;
  url: string;
  folderId: number;
  type: string;
  size: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  user: AuthUser | JwtPayload;
}

export interface UserWithTokenBody {
  accessToken: string;
  user: RootUser | JwtPayload;
}

export interface LoginBody extends UserWithTokenBody {
  msg: string;
}
export type LoginRes = Promise<Response<LoginBody> | undefined>;
export interface SignupBody extends UserDB {
  rootId: number;
}

export type SignupRes = Promise<Response<SignupBody> | undefined>;
export interface AppError extends Error {
  status?: number;
}

export type FolderRes = Promise<Response<CompleteFolder> | undefined>;
export type BaseUserRes = Promise<Response<BaseUser | undefined> | undefined>;
export type CompleteUserRes = Promise<
  Response<CompleteUser | MsgBody> | undefined
>;

import { FileDB, FolderDB } from "./folder.types";

export interface BaseUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface RootUser extends BaseUser {
  rootId: number;
  createdAt: Date;
}

export interface AuthUser extends RootUser {
  password: string;
}

export interface UserDB extends BaseUser {
  password: string;
  createdAt: Date;
}

export interface CompleteUser extends BaseUser {
  createdAt: Date;
  folders: FolderDB[];
  files: FileDB[];
}

export interface CompleteUserDB extends CompleteUser {
  password: string;
}

// export interface UserCore {
//   name: string;
//   username: string;
//   email: string;
//   password: string;
// }

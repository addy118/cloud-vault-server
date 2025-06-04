import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import db from "../../config/prismaClient";
import {
  UserDB,
  CompleteUser,
  CompleteUserDB,
  BaseUser,
} from "types/user.types";

class User {
  static async create(
    name: string,
    username: string,
    email: string,
    password: string,
  ): Promise<UserDB | undefined> {
    try {
      const user = await db.user.create({
        data: { name, username, email, password },
      });
      return user;
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          "A user with this email, phone or username already exists.",
        );
      }

      if (error instanceof Error) {
        console.error("Error creating user: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async getBasicInfo(id: number): Promise<BaseUser | undefined> {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      });

      if (!user) throw new Error("User not found.");
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching user info: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async getById(id: number): Promise<CompleteUser | undefined> {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          createdAt: true,
          folders: true,
          files: true,
        },
      });

      if (!user) throw new Error("No user found.");
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching user by ID: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async get(data: string): Promise<CompleteUserDB | undefined> {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [{ username: data }, { email: data }],
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          password: true,
          createdAt: true,
          files: true,
          folders: true,
        },
      });

      if (!user) throw new Error("No user found.");
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching user by email/username: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async getNameById(id: number): Promise<string | undefined> {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!user) throw new Error("No user found with given name.");
      return user.name;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching name by ID: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async getIdbyUserName(username: string): Promise<Number | undefined> {
    try {
      const userId = await db.user.findFirst({
        where: { username },
        select: { id: true },
      });

      if (!userId) throw new Error("No user ID found with given username");
      return userId.id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching user ID by username: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async changeEmail(userId: number, email: string): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: { email },
      });
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("A user with this email already exists.");
      }

      if (error instanceof Error) {
        console.error("Error updating email: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async changeName(userId: number, name: string): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: { name },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching updating name: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async changeUserName(userId: number, username: string): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: { username },
      });
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("A user with this email already exists.");
      }

      if (error instanceof Error) {
        console.error("Error updating email: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async changePass(userId: number, password: string): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: { password },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating password: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async delete(userId: number): Promise<void> {
    try {
      await db.user.delete({
        where: { id: userId },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting user: ", error.stack);
        throw new Error(error.message);
      }
    }
  }
}

export default User;

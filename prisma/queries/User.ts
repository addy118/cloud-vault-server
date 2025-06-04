// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'db'.
const db = require("../../config/prismaClient");

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
class User {
  static async create(name: any, username: any, email: any, password: any) {
    try {
      const user = await db.user.create({
        data: { name, username, email, password },
      });
      return user;
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error creating user: ", error.stack);
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.code === "P2002") {
        // Handling unique constraint violation
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error();
        // "A user with this email, phone or username already exists."
      }
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to create user.");
    }
  }

  static async getBasicInfo(id: any) {
    try {
      return await db.user.findUnique({
        // @ts-expect-error TS(2304): Cannot find name 'Number'.
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          // phone: true,
        },
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error fetching user info: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to fetch user info.");
    }
  }

  static async get(data: any) {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [{ username: data }, { email: data }],
        },
        select: {
          id: true,
          name: true,
          username: true,
          // phone: true,
          email: true,
          password: true,
          createdAt: true,
          files: true,
          folders: true,
        },
      });
      return user;
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error fetching user by email/username: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to fetch user by email/username.");
    }
  }

  static async getById(id: any) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          // phone: true,
          email: true,
          createdAt: true,
          folders: true,
          files: true,
        },
      });
      return user;
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error fetching user by ID: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to fetch user by ID.");
    }
  }

  static async getNameById(id: any) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: { name: true },
      });
      return user.name;
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error fetching name by ID: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to fetch name by ID.");
    }
  }

  static async getIdbyUserName(username: any) {
    try {
      const userId = await db.user.findFirst({
        where: { username },
        select: { id: true },
      });
      // @ts-expect-error TS(2304): Cannot find name 'Number'.
      return Number(userId.id);
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error fetching ID by username: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to fetch ID by username.");
    }
  }

  static async changeEmail(userId: any, email: any) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { email },
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error changing email: ", error.stack);
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.code === "P2002") {
        // Handling unique constraint violation
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error("Email is already taken.");
      }
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to update user's email.");
    }
  }

  static async changeName(userId: any, name: any) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { name },
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error updating name: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to update user's name.");
    }
  }

  static async changeUserName(userId: any, username: any) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { username },
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error updating username: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to update user's username.");
    }
  }

  // static async changePhone(userId, phone) {
  //   try {
  //     await db.user.update({
  //       where: { id: User },
  //       data: { phone },
  //     });
  //   } catch (error) {
  //     console.error("Error updating name: ", error.stack);
  //     throw new Error("Failed to update user's phone.");
  //   }
  // }

  static async changePass(userId: any, password: any) {
    try {
      await db.user.update({
        where: { id: userId },
        data: { password },
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error updating password: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to update user password.");
    }
  }

  static async delete(userId: any) {
    try {
      await db.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error deleting user: ", error.stack);
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error("Failed to delete user.");
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = User;

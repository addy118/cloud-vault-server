import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import db from "../../config/prismaClient";
import { FileDB } from "../../types/folder.types";

class File {
  static async create(
    name: string,
    folderId: number,
    type: string,
    size: number,
    userId: number,
    url: string | null = null,
  ): Promise<void | undefined> {
    try {
      await db.file.create({
        data: { name, folderId, type, size, userId, url },
      });
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          `File with the same name already exists in this folder for the user.`,
        );
      }

      if (error instanceof Error) {
        console.error("Error uploading file: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async getById(fileId: number): Promise<FileDB | undefined> {
    try {
      const file = await db.file.findFirst({
        where: {
          id: fileId,
        },
      });

      if (!file) {
        throw new Error(`File with ID ${fileId} not found.`);
      }
      return file;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error retreiving file with ID: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async deleteById(fileId: number): Promise<string | undefined> {
    try {
      const file = await this.getById(fileId);
      await db.file.delete({
        where: { id: fileId },
      });

      if (!file) throw new Error("Error finding file.");
      return `File with ID ${fileId} deleted successfully.`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting file with ID: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async getFolderId(fileId: number): Promise<number | undefined> {
    try {
      const file = await this.getById(fileId);

      if (!file) throw new Error("Error finding file.");
      return file.folderId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Error retrieving folder ID for file with ID: ",
          error.stack,
        );
        throw new Error(error.message);
      }
    }
  }
}

export default File;

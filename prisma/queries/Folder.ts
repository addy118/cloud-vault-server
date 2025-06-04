import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import db from "../../config/prismaClient";
import { FolderDB, CompleteFolder } from "../../types/folder.types";

class Folder {
  static async create(
    name: string,
    parentId: number,
    userId: number,
  ): Promise<FolderDB | undefined> {
    try {
      const folder = await db.folder.create({
        data: {
          name,
          parentId,
          userId,
        },
      });

      if (!folder) throw new Error("Error creating a new folder.");
      return folder;
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          `A folder with the name '${name}' already exists in this parent folder for user ID ${userId}.`,
        );
      }

      if (error instanceof Error) {
        console.error("Error creating folder: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async createRoot(userId: number): Promise<FolderDB | undefined> {
    try {
      const root = await db.folder.create({
        data: {
          name: "Root",
          userId: userId,
        },
      });

      if (!root) throw new Error("Error creating a root folder.");
      return root;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating root folder for user ID: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async getRootId(userId: number): Promise<{ id: number } | undefined> {
    try {
      const rootId = await db.folder.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (!rootId) {
        throw new Error(`Root folder ID not found for user ID ${userId}.`);
      }
      return rootId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Error retrieving root folder ID for user ID: ",
          error.stack,
        );
        throw new Error(error.message);
      }
    }
  }

  static async getRoot(userId: number): Promise<CompleteFolder | undefined> {
    try {
      const rootFolder = await db.folder.findFirst({
        where: {
          userId: userId,
          parentId: null,
        },
        include: {
          subFolders: true,
          files: true,
        },
      });

      if (!rootFolder) {
        throw new Error(`Root folder not found for user ID ${userId}.`);
      }
      return rootFolder;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Error retrieving root folder for user ID: ",
          error.stack,
        );
        throw new Error(error.message);
      }
    }
  }

  static async getParent(childId: number): Promise<CompleteFolder | undefined> {
    try {
      const childFolder = await this.getItemsById(childId);
      if (!childFolder) {
        throw new Error(`Child folder with ID ${childId} not found.`);
      }

      if (!childFolder.parentId) throw new Error("No parent ID found.");
      const parentFolder = await this.getItemsById(childFolder.parentId);

      if (!parentFolder) {
        throw new Error(`Parent folder for child ID ${childId} not found.`);
      }
      return parentFolder;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Error retrieving parent folder for child ID: ",
          error.stack,
        );
        throw new Error(error.message);
      }
    }
  }

  static async getItemsById(
    folderId: number,
  ): Promise<CompleteFolder | undefined> {
    try {
      const folder = await db.folder.findFirst({
        where: {
          id: folderId,
        },
        include: {
          subFolders: true,
          files: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      if (!folder) {
        throw new Error(`Folder with ID ${folderId} not found.`);
      }
      return folder;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error retrieving folder with ID: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async deleteById(folderId: number): Promise<string | undefined> {
    try {
      await db.folder.delete({
        where: { id: folderId },
      });

      return `Folder with ID ${folderId} deleted successfully.`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting folder with ID: ", error.stack);
        throw new Error(error.message);
      }
    }
  }
}

export default Folder;

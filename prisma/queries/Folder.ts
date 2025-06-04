// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'db'.
const db = require("../../config/prismaClient");

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Folder'.
class Folder {
  static async create(name: any, parentId: any, userId: any) {
    try {
      return await db.folder.create({
        data: {
          name,
          parentId,
          userId,
        },
      });
    } catch (error) {
      // handle unique constraint error
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(
          `A folder with the name '${name}' already exists in this parent folder for user ID ${userId}.`
        );
      }
      // rethrow other errors
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(`Error creating folder '${name}': ${error.message}`);
    }
  }

  static async createRoot(userId: any) {
    try {
      return await db.folder.create({
        data: {
          name: "Root",
          userId: userId,
        },
      });
    } catch (error) {
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error creating root folder for user ID ${userId}: ${error.message}`
      );
    }
  }

  static async getRootId(userId: any) {
    try {
      const rootId = await db.folder.findFirst({
        where: { userId },
        select: { id: true },
      });
      if (!rootId) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Root folder ID not found for user ID ${userId}.`);
      }
      return rootId;
    } catch (error) {
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error retrieving root folder ID for user ID ${userId}: ${error.message}`
      );
    }
  }

  static async getRoot(userId: any) {
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
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Root folder not found for user ID ${userId}.`);
      }
      return rootFolder;
    } catch (error) {
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error retrieving root folder for user ID ${userId}: ${error.message}`
      );
    }
  }

  static async getParent(childId: any) {
    try {
      const childFolder = await this.getItemsById(childId);
      if (!childFolder) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Child folder with ID ${childId} not found.`);
      }
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      const parentFolder = await this.getItemsById(childFolder.parentId);
      if (!parentFolder) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Parent folder for child ID ${childId} not found.`);
      }
      return parentFolder;
    } catch (error) {
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error retrieving parent folder for child ID ${childId}: ${error.message}`
      );
    }
  }

  static async getItemsById(folderId: any) {
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
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Folder with ID ${folderId} not found.`);
      }
      return folder;
    } catch (error) {
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error retrieving folder with ID ${folderId}: ${error.message}`
      );
    }
  }

  static async deleteById(folderId: any) {
    try {
      // const folder = await this.getItemsById(folderId);
      await db.folder.delete({
        where: { id: folderId },
      });
      return `Folder with ID ${folderId} deleted successfully.`;
    } catch (error) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.message.includes("not found")) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Cannot delete: ${error.message}`);
      }
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error deleting folder with ID ${folderId}: ${error.message}`
      );
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Folder;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'db'.
const db = require("../../config/prismaClient");

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'File'.
class File {
  static async create(name: any, folderId: any, type: any, size: any, userId: any, url = null) {
    try {
      await db.file.create({
        data: { name, folderId, type, size, userId, url },
      });
    } catch (error) {
      // check if the error is a P2002 unique constraint violation
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(
          "File with the same name already exists in this folder for the user."
        );
      }
      // rethrow other errors
      throw error;
    }
  }

  static async getById(fileId: any) {
    try {
      const file = await db.file.findFirst({
        where: {
          id: fileId,
        },
      });
      if (!file) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`File with ID ${fileId} not found.`);
      }
      return file;
    } catch (error) {
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error retrieving file with ID ${fileId}: ${error.message}`
      );
    }
  }

  // static async getById(fileId) {
  //   return await db.file.findFirst({
  //     where: {
  //       id: fileId,
  //     },
  //   });
  // }

  static async deleteById(fileId: any) {
    try {
      const file = await this.getById(fileId);
      await db.file.delete({
        where: { id: fileId },
      });
      return `File with ID ${fileId} deleted successfully.`;
    } catch (error) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.message.includes("not found")) {
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Cannot delete: ${error.message}`);
      }
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error deleting file with ID ${fileId}: ${error.message}`
      );
    }
  }

  static async getFolderId(fileId: any) {
    try {
      const file = await this.getById(fileId);
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      return file.folderId;
    } catch (error) {
      // @ts-expect-error TS(2304): Cannot find name 'Error'.
      throw new Error(
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        `Error retrieving folder ID for file with ID ${fileId}: ${error.message}`
      );
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = File;

import supabase from "../../config/supabase";
import File from "./File";
import Folder from "./Folder";
import { FileDB } from "../../types/folder.types";

class Supabase {
  static async removeFile(
    fileId: number,
    userId: number,
  ): Promise<void | undefined> {
    try {
      const folderId = await File.getFolderId(fileId);
      const file = await File.getById(fileId);

      if (!folderId) throw new Error("No parent folder found.");
      if (!file) throw new Error("No file found.");

      await supabase.storage
        .from("files")
        .remove([`${userId}/${folderId}/${file.name}.${file.type}`]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in removeFile: ", error.stack);
        throw new Error(error.message);
      }
    }
  }

  static async removeFolder(
    folderId: number,
    userId: number,
  ): Promise<void | undefined> {
    try {
      const folderItems = await Folder.getItemsById(folderId);
      if (!folderItems) throw new Error("No folder found.");

      const fileDeletePromises = folderItems.files.map(async (file) => {
        const filePath = `${userId}/${folderId}/${file.name}.${file.type}`;
        console.log("removing file:", filePath);

        await supabase.storage.from("files").remove([filePath]);
      });

      await Promise.all(fileDeletePromises);

      const subfolderDeletePromises = folderItems.subFolders.map(
        async (subFolder) => {
          await Supabase.removeFolder(subFolder.id, userId);
          await Folder.deleteById(subFolder.id);
        },
      );

      await Promise.all(subfolderDeletePromises);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in removeFolder: ", error.stack);
        throw new Error(error.message);
      }
    }
  }
}
export default Supabase;

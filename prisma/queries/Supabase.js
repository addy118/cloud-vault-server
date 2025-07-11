const supabase = require("../../config/supabase");
const File = require("./File");
const Folder = require("./Folder");

class Supabase {
  static async removeFile(fileId, userId) {
    const folderId = await File.getFolderId(Number(fileId));
    const file = await File.getById(fileId);

    // console.log(folderId, fileId, userId);
    // console.log(`${userId}/${folderId}/${file.name}.${file.type}`);

    const { data, error } = await supabase.storage
      .from("files")
      .remove([`${userId}/${folderId}/${file.name}.${file.type}`]);

    if (error) {
      console.error("Error in Supabaase.removeFile: ", error.message);
      console.error(error.stack);
      throw new Error("Unable to delete file from supabase.");
    }
  }

  static async removeFolder(folderId, userId) {
    const folderItems = await Folder.getItemsById(folderId);

    // async func to remove files inside the folder
    const fileDeletePromises = folderItems.files.map(async (file) => {
      const filePath = `${userId}/${folderId}/${file.name}.${file.type}`;
      // console.log("removing file:", filePath);
      await supabase.storage.from("files").remove([filePath]);
    });
    await Promise.all(fileDeletePromises);

    // async func to recursively delete subfolders
    const subfolderDeletePromises = folderItems.subFolders.map(
      async (subFolder) => {
        // recursively delete files in subfolder
        await Supabase.removeFolder(subFolder.id, userId);
        // delete subfolder metadata from db
        await Folder.deleteById(subFolder.id);
      }
    );
    await Promise.all(subfolderDeletePromises);
  }
}

module.exports = Supabase;

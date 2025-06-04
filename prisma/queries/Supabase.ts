// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supabase'.
const supabase = require("../../config/supabase");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'File'.
const File = require("./File");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Folder'.
const Folder = require("./Folder");

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Supabase'.
class Supabase {
  static async removeFile(fileId: any, userId: any) {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    const folderId = await File.getFolderId(Number(fileId));
    const file = await File.getById(fileId);

    await supabase.storage
      .from("files")
      .remove([`${userId}/${folderId}/${file.name}.${file.type}`]);
  }

  static async removeFolder(folderId: any, userId: any) {
    const folderItems = await Folder.getItemsById(folderId);

    // async func to remove files inside the folder
    // @ts-expect-error TS(2697): An async function or method must return a 'Promise... Remove this comment to see the full error message
    const fileDeletePromises = folderItems.files.map(async (file: any) => {
      const filePath = `${userId}/${folderId}/${file.name}.${file.type}`;
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("removing file:", filePath);
      await supabase.storage.from("files").remove([filePath]);
    });
    // @ts-expect-error TS(2583): Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    await Promise.all(fileDeletePromises);

    // async func to recursively delete subfolders
    const subfolderDeletePromises = folderItems.subFolders.map(
      // @ts-expect-error TS(2697): An async function or method must return a 'Promise... Remove this comment to see the full error message
      async (subFolder: any) => {
        // recursively delete files in subfolder
        await Supabase.removeFolder(subFolder.id, userId);
        // delete subfolder metadata from db
        await Folder.deleteById(subFolder.id);
      }
    );
    // @ts-expect-error TS(2583): Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    await Promise.all(subfolderDeletePromises);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Supabase;

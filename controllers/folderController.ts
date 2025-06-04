// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Folder'.
const Folder = require("../prisma/queries/Folder");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Supabase'.
const Supabase = require("../prisma/queries/Supabase");

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.getFolder = async (req: any, res: any, next: any) => {
  const { folderId } = req.params;

  // @ts-expect-error TS(2304): Cannot find name 'Number'.
  const folderDetails = await Folder.getItemsById(Number(folderId));
  // console.log("folder " + folderId + " rendered!");

  if (!folderDetails) {
    // @ts-expect-error TS(2304): Cannot find name 'Error'.
    const err = new Error("Folder Not Found");
    err.status = 404;
    return next(err);
  }

  res.json(folderDetails);
};

// create folder form
// exports.getNewFolder = (req, res) => {
//   const { folderId } = req.params;

//   res.render("folderForm", {
//     title: "New Folder",
//     parentId: folderId,
//   });
// };

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postNewFolder = async (req: any, res: any) => {
  try {
    // current folderId
    const { folderId } = req.params;
    const { folderName, userId } = req.body;

    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    await Folder.create(folderName, Number(folderId), userId);
    // res.redirect(`/${folderId}/folder`);
    res.json({ msg: "Folder created successfully!" });
  } catch (error) {
    // send user-friendly error message
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(400).json({ msg: error.message });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postDeleteFolder = async (req: any, res: any) => {
  // @ts-expect-error TS(2304): Cannot find name 'Number'.
  const folderId = Number(req.params.folderId);
  // @ts-expect-error TS(2304): Cannot find name 'Number'.
  const userId = Number(req.body);

  // const parent = await Folder.getParent(folderId);

  try {
    // delete the contents of the folder (files and subfolders)
    await Supabase.removeFolder(folderId, userId);

    // delete the folder metadata itself from db
    await Folder.deleteById(folderId);

    // redirect to the parent folder
    // res.redirect(`/${parent.id}/folder`);
    res.json({ msg: "Folder deleted successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error deleting the folder: ", err.message);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Stack: ", err.stack);
    res.status(500).json({ msg: "Failed to remove folder and its files." });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.appError = (err: any, req: any, res: any, next: any) => {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Folder Controller",
    error: err.message,
  });
};

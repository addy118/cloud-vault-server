
const Folder = require("../prisma/queries/Folder");

const Supabase = require("../prisma/queries/Supabase");


exports.getFolder = async (req: any, res: any, next: any) => {
  const { folderId } = req.params;

  
  const folderDetails = await Folder.getItemsById(Number(folderId));
  

  if (!folderDetails) {
    
    const err = new Error("Folder Not Found");
    err.status = 404;
    return next(err);
  }

  res.json(folderDetails);
};












exports.postNewFolder = async (req: any, res: any) => {
  try {
    
    const { folderId } = req.params;
    const { folderName, userId } = req.body;

    
    await Folder.create(folderName, Number(folderId), userId);
    
    res.json({ msg: "Folder created successfully!" });
  } catch (error) {
    
    
    res.status(400).json({ msg: error.message });
  }
};


exports.postDeleteFolder = async (req: any, res: any) => {
  
  const folderId = Number(req.params.folderId);
  
  const userId = Number(req.body);

  

  try {
    
    await Supabase.removeFolder(folderId, userId);

    
    await Folder.deleteById(folderId);

    
    
    res.json({ msg: "Folder deleted successfully!" });
  } catch (err) {
    
    console.error("Error deleting the folder: ", err.message);
    
    console.error("Stack: ", err.stack);
    res.status(500).json({ msg: "Failed to remove folder and its files." });
  }
};


exports.appError = (err: any, req: any, res: any, next: any) => {
  
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Folder Controller",
    error: err.message,
  });
};

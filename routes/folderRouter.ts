
const { Router } = require("express");
const {
  getFolder,
  postDeleteFolder,
  getNewFolder,
  postNewFolder,

} = require("../controllers/folderController");

const folderRouter = Router();


folderRouter.get("/:folderId", getFolder);
folderRouter.post("/:folderId", postNewFolder);
folderRouter.delete("/:folderId", postDeleteFolder);


module.exports = folderRouter;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Router'.
const { Router } = require("express");
const {
  getFolder,
  postDeleteFolder,
  getNewFolder,
  postNewFolder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require("../controllers/folderController");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'folderRout... Remove this comment to see the full error message
const folderRouter = Router();

// folderRouter.get("/:folderId/create", getNewFolder);
folderRouter.get("/:folderId", getFolder);
folderRouter.post("/:folderId", postNewFolder);
folderRouter.delete("/:folderId", postDeleteFolder);

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = folderRouter;

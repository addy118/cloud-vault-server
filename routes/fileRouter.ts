// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Router'.
const { Router } = require("express");
const {
  getUpload,
  postUpload,
  postDeleteFile,
  postDownloadFile,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require("../controllers/fileController");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadFile... Remove this comment to see the full error message
const { uploadFiles, multerError } = require("../config/multer");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fileRouter... Remove this comment to see the full error message
const fileRouter = Router();

// fileRouter.get("/:folderId/upload", getUpload);
fileRouter.post("/:folderId", uploadFiles, multerError, postUpload);
fileRouter.post("/:userId/:folderId/:fileId/download", postDownloadFile);

fileRouter.delete("/:fileId", postDeleteFile);

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = fileRouter;

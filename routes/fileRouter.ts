
const { Router } = require("express");
const {
  getUpload,
  postUpload,
  postDeleteFile,
  postDownloadFile,

} = require("../controllers/fileController");

const { uploadFiles, multerError } = require("../config/multer");

const fileRouter = Router();


fileRouter.post("/:folderId", uploadFiles, multerError, postUpload);
fileRouter.post("/:userId/:folderId/:fileId/download", postDownloadFile);

fileRouter.delete("/:fileId", postDeleteFile);


module.exports = fileRouter;

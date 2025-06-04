import { Router } from "express";
import {
  postUpload,
  postDeleteFile,
  postDownloadFile,
} from "../controllers/fileController";
const { uploadFiles, multerError } = require("../config/multer");
const fileRouter = Router();

fileRouter.post("/:folderId", uploadFiles, multerError, postUpload);
fileRouter.post("/:userId/:folderId/:fileId/download", postDownloadFile);

fileRouter.delete("/:fileId", postDeleteFile);

export default fileRouter;

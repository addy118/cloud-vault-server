import { Router } from "express";
import {
  getFolder,
  postDeleteFolder,
  postNewFolder,
} from "../controllers/folderController";

const folderRouter = Router();

folderRouter.get("/:folderId", getFolder);
folderRouter.post("/:folderId", postNewFolder);
folderRouter.delete("/:folderId", postDeleteFolder);

export default folderRouter;

import { NextFunction, Request, Response } from "express";
import Folder from "../prisma/queries/Folder";
import Supabase from "../prisma/queries/Supabase";
import { AppError } from "../types/controller.types";

export const getFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | undefined> => {
  const { folderId } = req.params;
  const folderDetails = await Folder.getItemsById(Number(folderId));

  if (!folderDetails) {
    const err: AppError = new Error("Folder Not Found");
    err.status = 404;
    next(err);
  }

  res.json(folderDetails);
};

export const postNewFolder = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  try {
    const { folderId } = req.params;
    const { folderName, userId } = req.body;

    await Folder.create(folderName, Number(folderId), userId);

    res.json({ msg: "Folder created successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ msg: error.message });
    }
  }
};

export const postDeleteFolder = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const folderId = Number(req.params.folderId);
  const userId = Number(req.body);

  try {
    await Supabase.removeFolder(folderId, userId);
    await Folder.deleteById(folderId);

    res.json({ msg: "Folder deleted successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error deleting the folder: ", err.message);
      console.error("Stack: ", err.stack);
      res.status(500).json({ msg: "Failed to remove folder and its files." });
    }
  }
};

export const appError = (
  err: AppError,
  req: Request,
  res: Response,
  next: any,
): void => {
  console.error(err.stack);
  res.status(err.status || 500).json({ msg: err.message });
};

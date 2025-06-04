import File from "../prisma/queries/File";
import supabase from "../config/supabase";
import Supabase from "../prisma/queries/Supabase";
import { Request, Response } from "express";
import { FileCore } from "../types/controller.types";

export const postUpload = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { folderId } = req.params;
  const { userId } = req.body;

  if (!req.files || req.files.length === 0) {
    res.status(400).json({ msg: "No files uploaded!" });
  }

  try {
    // multer can create files[] or obj containing multiple files[] based on config
    if (!req.files || !Array.isArray(req.files))
      throw new Error("No files uploaded. ");

    const fileUploadPromises = req.files.map(
      async (file: Express.Multer.File): Promise<FileCore | undefined> => {
        const { data, error } = await supabase.storage
          .from("files")
          .upload(`${userId}/${folderId}/${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (error) {
          console.error(`Error uploading file: ${file.originalname}`, error);
          throw new Error(`Failed to upload ${file.originalname}`);
        }

        const { data: publicData } = supabase.storage
          .from("files")
          .getPublicUrl(`${userId}/${folderId}/${file.originalname}`);

        return {
          name: file.originalname.split(".")[0] || "Not Specified",
          folderId: Number(folderId),
          type: file.originalname.split(".")[1] || "Not Specified",
          size: file.size,
          userId: userId,
          url: publicData.publicUrl + "?download",
        };
      },
    );

    const files = await Promise.all(fileUploadPromises);

    await Promise.all(
      files.map(
        (file: FileCore | undefined) =>
          file &&
          File.create(
            file.name,
            file.folderId,
            file.type,
            file.size,
            file.userId,
            file.url,
          ),
      ),
    );

    res.json({ msg: "File uploaded successfully!" });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error uploading files:", err);
      res.status(500).json({
        msg: `Failed to upload files. ${err.message} Please try again!`,
      });
    }
  }
};

export const postDownloadFile = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const { userId, folderId, fileId } = req.params;

  try {
    const file = await File.getById(Number(fileId));
    if (!file) throw new Error("File not found.");

    const filePath = `${userId}/${folderId}/${file.name}.${file.type}`;
    const { data, error } = await supabase.storage
      .from("files")
      .download(filePath);

    if (error) {
      console.error("Error downloading file:", error.message);
      throw new Error("Failed to download file.");
    }

    res.setHeader("Content-Type", data.type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}.${file.type}"`,
    );

    const buffer = await data.arrayBuffer();
    const bufferData = Buffer.from(buffer);

    res.write(bufferData);
    res.end();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error: ", err.message);
      res
        .status(500)

        .json({
          msg: `Failed to process the download request: ${err.message}`,
        });
    }
  }
};

export const postDeleteFile = async (
  req: Request,
  res: Response,
): Promise<void | undefined> => {
  const fileId = Number(req.params.fileId);
  const { userId } = req.body;

  try {
    await Supabase.removeFile(fileId, userId);
    await File.deleteById(fileId);

    res.json({ msg: "File deleted successfully!" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error: ", err.message);
      console.error("Stack: ", err.stack);
      res.status(500).json({ msg: `Failed to remove files: ${err.message}` });
    }
  }
};

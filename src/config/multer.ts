import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import multer, { StorageEngine, ErrorCode } from "multer";
import path from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const diskStorage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    done: DestinationCallback,
  ): void => {
    done(null, path.join(__dirname, "../uploads"));
  },
  filename: (
    req: any,
    file: Express.Multer.File,
    done: FileNameCallback,
  ): void => {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    done(null, file.fieldname + "-" + uniqueSuffix + fileExt);
  },
});

const memoryStorage: StorageEngine = multer.memoryStorage();

const uploadFiles = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5.5 * 1000 * 1000,
    files: 10,
  },
}).array("files", 10);

const multerError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response<ErrorCode> => {
  if (err instanceof multer.MulterError) {
    return res.send(err.code);
  }
  // successfully move to next middleware
  next();
};

export { uploadFiles, multerError };

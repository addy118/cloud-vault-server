import dotenv from "dotenv";
dotenv.config();
const { PORT } = process.env;
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import fileRouter from "./routes/fileRouter";
import folderRouter from "./routes/folderRouter";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.message);
  console.error(err.stack);
  res.send("Something broke in server!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

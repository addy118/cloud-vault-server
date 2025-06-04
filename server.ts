
require("dotenv").config();

const express = require("express");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const authRouter = require("./routes/authRouter");

const userRouter = require("./routes/userRouter");

const fileRouter = require("./routes/fileRouter");

const folderRouter = require("./routes/folderRouter");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["https:
    credentials: true,
  })
);


const { PORT } = process.env;

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

app.use((err: any, req: any, res: any, next: any) => {
  
  console.error(err.message);
  
  console.error(err.stack);
  res.send("Something broke in server!");
});

app.listen(PORT, () => {
  
  console.log(`Server listening on port ${PORT}`);
});

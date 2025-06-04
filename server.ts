// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require("dotenv").config();
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const express = require("express");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cookieParser = require("cookie-parser");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cors = require("cors");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authRouter... Remove this comment to see the full error message
const authRouter = require("./routes/authRouter");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userRouter... Remove this comment to see the full error message
const userRouter = require("./routes/userRouter");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fileRouter... Remove this comment to see the full error message
const fileRouter = require("./routes/fileRouter");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'folderRout... Remove this comment to see the full error message
const folderRouter = require("./routes/folderRouter");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["https://cloudvaultt.netlify.app", "http://localhost:5173"],
    credentials: true,
  })
);

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const { PORT } = process.env;

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

app.use((err: any, req: any, res: any, next: any) => {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err.message);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.error(err.stack);
  res.send("Something broke in server!");
});

app.listen(PORT, () => {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`Server listening on port ${PORT}`);
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'File'.
const File = require("../prisma/queries/File");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supabase'.
const supabase = require("../config/supabase");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Supabase'.
const Supabase = require("../prisma/queries/Supabase");

// upload file form
// exports.getUpload = (req, res) => {
//   const { folderId } = req.params;
//   // res.render("fileForm", { title: "Upload Files", folderId: folderId });
// };

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postUpload = async (req: any, res: any) => {
  const { folderId } = req.params;
  const { userId } = req.body;
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log("file uploaded");

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ msg: "No files uploaded!" });
  }

  try {
    // upload each file to Supabase
    const fileUploadPromises = req.files.map(async (file: any) => {
      // upload file to supabase
      const { data, error } = await supabase.storage
        .from("files")
        .upload(`${userId}/${folderId}/${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.error(`Error uploading file: ${file.originalname}`, error);
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Failed to upload ${file.originalname}`);
      }

      // retrieve the public URL for the uploaded file
      const { data: publicData, error: urlError } = supabase.storage
        .from("files")
        .getPublicUrl(`${userId}/${folderId}/${file.originalname}`);

      if (urlError) {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.error(
          `Error fetching public URL: ${file.originalname}`,
          urlError
        );
        // @ts-expect-error TS(2304): Cannot find name 'Error'.
        throw new Error(`Failed to fetch public URL for ${file.originalname}`);
      }

      // construct file details
      return {
        name: file.originalname.split(".")[0],
        // @ts-expect-error TS(2304): Cannot find name 'Number'.
        folderId: Number(folderId),
        // type: file.mimetype.split("/")[1],
        type: file.originalname.split(".")[1],
        size: file.size,
        // @ts-expect-error TS(2304): Cannot find name 'Number'.
        userId: Number(userId),
        url: publicData.publicUrl + "?download",
      };
    });

    // wait for all uploads to complete
    // @ts-expect-error TS(2583): Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    const files = await Promise.all(fileUploadPromises);

    // save file details to database
    // @ts-expect-error TS(2583): Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
    await Promise.all(
      files.map((file: any) => File.create(
        file.name,
        file.folderId,
        file.type,
        file.size,
        file.userId,
        file.url
      )
      )
    );

    // res.redirect(`/${folderId}/folder`);
    res.json({ msg: "File uploaded successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error uploading files:", err);
    res.status(500).json({
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      msg: `Failed to upload files. ${err.message} Please try again!`,
    });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postDownloadFile = async (req: any, res: any) => {
  const { userId, folderId, fileId } = req.params;

  try {
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    const file = await File.getById(Number(fileId));
    const filePath = `${userId}/${folderId}/${file.name}.${file.type}`;

    const { data, error } = await supabase.storage
      .from("files")
      .download(filePath);

    if (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error("Error downloading file:", error);
      return res.status(500).json({ msg: "Failed to download file." });
    }

    res.setHeader("Content-Type", data.type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}.${file.type}"`
    );

    // convert blob to buffer
    const buffer = await data.arrayBuffer();
    // @ts-expect-error TS(2580): Cannot find name 'Buffer'. Do you need to install ... Remove this comment to see the full error message
    const bufferData = Buffer.from(buffer);

    // write the buffer to the response
    res.write(bufferData);
    res.end();
    // res.json({ msg: "File downloaded successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error: ", err.message);
    res
      .status(500)
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      .json({ msg: `Failed to process the download request: ${err.message}` });
  }
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.postDeleteFile = async (req: any, res: any) => {
  // @ts-expect-error TS(2304): Cannot find name 'Number'.
  const fileId = Number(req.params.fileId);
  const { userId } = req.body;
  // const folderId = await File.getFolderId(fileId);
  try {
    // check ownership - whether file with fileId is owned by user userId or not
    // @ts-expect-error TS(2304): Cannot find name 'Number'.
    await Supabase.removeFile(fileId, Number(userId));
    await File.deleteById(fileId);
    // res.redirect(`/${folderId}/folder`);
    res.json({ msg: "File deleted successfully!" });
  } catch (err) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Error: ", err.message);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error("Stack: ", err.stack);
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    res.status(500).json({ msg: `Failed to remove files: ${err.message}` });
  }
};


const File = require("../prisma/queries/File");

const supabase = require("../config/supabase");

const Supabase = require("../prisma/queries/Supabase");








exports.postUpload = async (req: any, res: any) => {
  const { folderId } = req.params;
  const { userId } = req.body;
  
  console.log("file uploaded");

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ msg: "No files uploaded!" });
  }

  try {
    
    const fileUploadPromises = req.files.map(async (file: any) => {
      
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

      
      const { data: publicData, error: urlError } = supabase.storage
        .from("files")
        .getPublicUrl(`${userId}/${folderId}/${file.originalname}`);

      if (urlError) {
        
        console.error(
          `Error fetching public URL: ${file.originalname}`,
          urlError
        );
        
        throw new Error(`Failed to fetch public URL for ${file.originalname}`);
      }

      
      return {
        name: file.originalname.split(".")[0],
        
        folderId: Number(folderId),
        
        type: file.originalname.split(".")[1],
        size: file.size,
        
        userId: Number(userId),
        url: publicData.publicUrl + "?download",
      };
    });

    
    
    const files = await Promise.all(fileUploadPromises);

    
    
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

    
    res.json({ msg: "File uploaded successfully!" });
  } catch (err) {
    
    console.error("Error uploading files:", err);
    res.status(500).json({
      
      msg: `Failed to upload files. ${err.message} Please try again!`,
    });
  }
};


exports.postDownloadFile = async (req: any, res: any) => {
  const { userId, folderId, fileId } = req.params;

  try {
    
    const file = await File.getById(Number(fileId));
    const filePath = `${userId}/${folderId}/${file.name}.${file.type}`;

    const { data, error } = await supabase.storage
      .from("files")
      .download(filePath);

    if (error) {
      
      console.error("Error downloading file:", error);
      return res.status(500).json({ msg: "Failed to download file." });
    }

    res.setHeader("Content-Type", data.type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}.${file.type}"`
    );

    
    const buffer = await data.arrayBuffer();
    
    const bufferData = Buffer.from(buffer);

    
    res.write(bufferData);
    res.end();
    
  } catch (err) {
    
    console.error("Error: ", err.message);
    res
      .status(500)
      
      .json({ msg: `Failed to process the download request: ${err.message}` });
  }
};


exports.postDeleteFile = async (req: any, res: any) => {
  
  const fileId = Number(req.params.fileId);
  const { userId } = req.body;
  
  try {
    
    
    await Supabase.removeFile(fileId, Number(userId));
    await File.deleteById(fileId);
    
    res.json({ msg: "File deleted successfully!" });
  } catch (err) {
    
    console.error("Error: ", err.message);
    
    console.error("Stack: ", err.stack);
    
    res.status(500).json({ msg: `Failed to remove files: ${err.message}` });
  }
};

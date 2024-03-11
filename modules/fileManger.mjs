import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const fileUploadMiddleware = (fileType) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  return upload.array(fileType);
};
function imageManger(fileType) {
  return (req, res, next) => {
    fileUploadMiddleware(fileType)(req, res, async (err) => {
      if (err) {
        return res.status(500).send("File upload fail to server.");
      }
      const reducedImages = [];
      let unsupportedFileTypeEncountered = false;
      await Promise.all(
        req.files.map(async (img) => {
          if (
            img.mimetype == "image/jpg" ||
            img.mimetype == "image/jpeg" ||
            img.mimetype == "image/png"
          ) {
            const reducedImageBuffer = await sharp(img.buffer)
              .resize(300, 300)
              .jpeg({ quality: 50 })
              .toBuffer();
            reducedImages.push(reducedImageBuffer);
          } else {
            unsupportedFileTypeEncountered = true;
          }
        })
      );
      if (unsupportedFileTypeEncountered) {
        return res
          .status(400)
          .send(
            "Please select a valid file type. Supported formats include JPG, JPEG, or PNG"
          );
      }
      if (req.files.length === 0) {
        req.reducedImages = null;
      } else {
        req.reducedImages = reducedImages;
      }
      next();
    });
  };
}

export default imageManger;

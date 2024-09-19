import sharp from "sharp";
import fs from "fs-extra";
import path from "path";
import resizeImage from "./resizeImage.js";

const TRIM_OPTIONS = {
  threshold: 1,
};

async function processImportedImage(file, filePath) {
  // build the file paths
  const filePathIn = path.join(filePath, file);
  const filePathOut = path.join(filePath, "cropped", file);

  // ensure the cropped folder exists
  await fs.ensureDir(path.join(filePath, "cropped"));

  // trim whitespace from image
  const buffer = await sharp(filePathIn).trim(TRIM_OPTIONS).png({ quality: 80, palette: true }).toBuffer();
  fs.writeFileSync(filePathOut, buffer);

  // resize the image
  await resizeImage(file, filePath);
}

export default processImportedImage;

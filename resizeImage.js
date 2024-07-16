import fs from "fs";
import sharp from "sharp";
import path from "path";
import { ensureDir } from "fs-extra";

// Configuration
const CONFIG = {
  compressed: {
    maxWidth: 200,
    minHeight: 175,
  },
  digital: {
    maxWidth: 400,
    minHeight: 400,
  },
  print: {
    maxWidth: 600,
    minHeight: 600,
  },
};

const IMAGE_CACHE_FOLDER = "build/online_image_cache";

async function ensureCatalogTypeDirectoriesExists() {
  for (const [catalogType] of Object.entries(CONFIG)) {
    await ensureDir(path.join(IMAGE_CACHE_FOLDER, catalogType));
  }
}

async function resizeImageForFolder(
  file,
  filePath,
  catalogType,
  maxWidth,
  minHeight
) {
  const filePathIn = path.join(filePath, "cropped", file);
  const filePathOut = path.join(filePath, catalogType, file);

  // resize image
  try {
    const image = sharp(filePathIn);
    const metadata = await image.metadata();

    if (metadata.width > maxWidth || metadata.height > minHeight) {
      // Scale the image so that the width becomes the maxWidth and the height is scaled proportionally
      // But if the height becomes less than the minHeight, then scale the image so that the height becomes the minHeight and the width is scaled proportionally
      const widthScalingFactor = maxWidth / metadata.width;
      const proposedHeight = metadata.height * widthScalingFactor;
      let resizedWidth, resizedHeight;
      if (proposedHeight < minHeight) {
        const heightScalingFactor = minHeight / metadata.height;
        resizedWidth = Math.round(metadata.width * heightScalingFactor);
        resizedHeight = Math.round(metadata.height * heightScalingFactor);
      } else {
        resizedWidth = maxWidth;
        resizedHeight = Math.round(metadata.height * widthScalingFactor);
      }

      await image
        .resize(resizedWidth, resizedHeight)
        .toBuffer()
        .then(async (buffer) => {
          await fs.promises.writeFile(filePathOut, buffer);
        })
        .catch((err) => {
          console.error(`Error resizing image: ${err}`);
        });
    } else {
      await image.toBuffer().then(async (buffer) => {
        await fs.promises.writeFile(filePathOut, buffer);
      });
    }
  } catch (err) {
    console.log(err + " for " + filePath);
  }
}

async function resizeImage(file, filepath) {
  await ensureCatalogTypeDirectoriesExists();
  for (const [catalogType, folderConfig] of Object.entries(CONFIG)) {
    // set sizes needed for resizing images
    const maxWidth = folderConfig.maxWidth;
    const minHeight = folderConfig.minHeight;

    // resize image
    await resizeImageForFolder(
      file,
      filepath,
      catalogType,
      maxWidth,
      minHeight
    );
  }
}

export default resizeImage;

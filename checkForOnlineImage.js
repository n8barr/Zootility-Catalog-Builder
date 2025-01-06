import axios from "axios";
import processImportedImage from "./processImportedImage.js";
import fs from "fs";
import path from "path";
const IMAGE_CACHE_FOLDER = "build/online_image_cache";

async function checkForOnlineImage(onlineImgUrl, catalogStyle) {
  if (!onlineImgUrl) {
    return;
  }
  // check for the image in the cache, based on the name of the onlineImgUrl
  const onlineImgUrlParts = onlineImgUrl.split("/");
  const onlineImgUrlFileName = onlineImgUrlParts[onlineImgUrlParts.length - 1];
  // remove the query string from the filename
  const onlineImgUrlFileNameParts = onlineImgUrlFileName.split("?v=");
  const version = onlineImgUrlFileNameParts[1];
  const fileNameWithoutQuery = onlineImgUrlFileNameParts[0];
  const fileNameParts = fileNameWithoutQuery.split("_");
  let baseFileName
  if (fileNameParts.length > 1) {
    baseFileName = fileNameParts[0];
  } else {
    // remove the extension from the filenam
    baseFileName = fileNameWithoutQuery.split(".")[0];
  }
  const extension = path.extname(fileNameWithoutQuery);
  const localImgFileName = `${baseFileName}-${version}${extension}`;
  const downloadImagePath = path.join(IMAGE_CACHE_FOLDER, localImgFileName);
  const processedImagePath = path.join(
    IMAGE_CACHE_FOLDER,
    catalogStyle,
    localImgFileName
  );
  const htmlImagePath = "../../" + processedImagePath;

  if (fs.existsSync(processedImagePath)) {
    return htmlImagePath;
  } else {
    // try to download the image
    const options = {
      url: onlineImgUrl,
      responseType: "arraybuffer", // or 'stream'
    };
    console.log(`Downloading image ${localImgFileName}...`);
    try {
      const response = await axios(options);
      const downloadDir = path.dirname(downloadImagePath);
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }
      fs.writeFileSync(downloadImagePath, response.data);
      await processImportedImage(localImgFileName, downloadDir);
      return htmlImagePath;
    } catch (error) {
      console.error(`Error downloading image ${onlineImgUrl}: ${error}`);
    }
    return;
  }
}

export default checkForOnlineImage;

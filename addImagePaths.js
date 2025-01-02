import fs from "fs";
import path from "path";
import checkForOnlineImage from "./checkForOnlineImage.js";

// Read the modified_skus.json file and store the skus in an array
const originalImageSkus = JSON.parse(
  fs.readFileSync("original_image_skus.json", "utf8")
);

// Set the constants for both functions
const SUPPORTED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".PNG",
  ".jpeg",
  ".JPEG",
  ".JPG",
];
const CROPPED_FOLDER = "build/cropped_images";
const ORIGINAL_FOLDER = "build/original_images";
const LIFESTYLE_FOLDER = "build/lifestyle_images";
const PACKAGING_FOLDER = "build/packaging_images";

async function addVariantImages(variant, catalogStyle) {
  const sku = variant.sku;
  const [subfolder1, subfolder2] = sku.split("-");
  const basePath = originalImageSkus.includes(variant.sku)
    ? ORIGINAL_FOLDER
    : CROPPED_FOLDER;

  for (let i = 1; i <= 2; i++) {
    for (const ext of SUPPORTED_EXTENSIONS) {
      const imageFileName = i === 1 ? `${sku}${ext}` : `${sku}-${i}${ext}`;
      const imagePath = path.join(
        basePath,
        catalogStyle,
        subfolder1,
        subfolder2,
        imageFileName
      );

      if (fs.existsSync(imagePath)) {
        const htmlImagePath = "../../" + imagePath;
        variant.images.push(htmlImagePath);
        break;
      }
    }
  }

  // if no image was found, check for the image online
  if (variant.images.length === 0) {
    const onlineImgUrl = variant.onlineVariantImgUrl;
    const imageFound = await checkForOnlineImage(onlineImgUrl, catalogStyle);
    if (imageFound) {
      variant.images.push(imageFound);
    }
  }
}

async function addProductImages(product, catalogStyle) {
  if (!product.images) {
    product.images = [];
  }
  // Check for and add the Lifestyle image
  const lifestyleFolderPath = path.join(LIFESTYLE_FOLDER, catalogStyle);
  const lifestyleImagePath = getAdditionalImagePath(
    product,
    lifestyleFolderPath
  );
  if (lifestyleImagePath) {
    product.hasLifestyleImage = true;
    product.images.push(lifestyleImagePath);

    // check if the image is a jpg format
    const jpgRegex = /\.(jpg|jpeg)$/i;

    if (jpgRegex.test(lifestyleImagePath)) {
      product.hasJpgImage = true;
    }
  }

  // Check for and add the Packaging image
  const packagingFolderPath = path.join(PACKAGING_FOLDER, catalogStyle);
  const packagingImagePath = getAdditionalImagePath(
    product,
    packagingFolderPath
  );
  if (packagingImagePath) {
    product.hasPackagingImage = true;
    product.images.push(packagingImagePath);
  } else {
    // if no image was found, check for the packaging image on the product
    if (product.packagingImage) {
      const onlineImg = product.packagingImage;
      product.hasPackagingImage = true;
      product.images.push(onlineImg);
    }
  }
}

function getAdditionalImagePath(product, folder) {
  const [subfolder1, subfolder2] = product.sku.split("-");
  const baseSku = `${subfolder1}-${subfolder2}`;

  for (let i = 1; i <= 2; i++) {
    for (const ext of SUPPORTED_EXTENSIONS) {
      const productImageName =
        i === 1 ? `${baseSku}${ext}` : `${baseSku}-${i}${ext}`;
      const imagePath = path.join(folder, subfolder1, productImageName);

      if (fs.existsSync(imagePath)) {
        const htmlImagePath = "../../" + imagePath;
        return htmlImagePath;
      }
    }
  }
  return false;
}

export { addProductImages, addVariantImages };

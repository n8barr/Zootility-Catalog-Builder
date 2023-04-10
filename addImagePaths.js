import fs from 'fs';
import path from 'path';

// Read the modified_skus.json file and store the skus in an array
const originalImageSkus = JSON.parse(fs.readFileSync('original_image_skus.json', 'utf8'));

// Set the constants for both functions
const extensions = ['.png', '.jpg', '.jpeg', '.PNG', '.jpeg', '.JPEG', '.JPG'];
const croppedFolder = 'cropped_images';
const originalFolder = 'original_images';
const lifestyleFolder = 'lifestyle_images';
const packagingFolder = 'packaging_images';

function addVariantImages(variant) {
  const sku = variant.sku;
  const [subfolder1, subfolder2] = sku.split('-');
  const basePath = originalImageSkus.includes(variant.sku) ? originalFolder : croppedFolder;

  for (let i = 1; i <= 4; i++) {
    for (const ext of extensions) {
      const imageFileName = i === 1 ? `${sku}${ext}` : `${sku}-${i}${ext}`;
      const imagePath = path.join(basePath, subfolder1, subfolder2, imageFileName);

      if (fs.existsSync(imagePath)) {
        variant.images.push(imagePath);
        break;
      }
    }
  }
};

function addProductImages(product) {
  if (!product.images) {
    product.images = [];
  }
  // Check for and add the Lifestyle image
  const lifestyleImagePath = getAdditionalImagePath(product, lifestyleFolder);
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
  const packagingImagePath = getAdditionalImagePath(product, packagingFolder);
  if (packagingImagePath) {
    product.hasPackagingImage = true;
    product.images.push(packagingImagePath);
  }
};

function getAdditionalImagePath(product, folder) {
  const [subfolder1, subfolder2] = product.sku.split('-');
  const baseSku = `${subfolder1}-${subfolder2}`;

  for (let i = 1; i <= 2; i++) {
    for (const ext of extensions) {
      const productImageName = i === 1 ? `${baseSku}${ext}` : `${baseSku}-${i}${ext}`;
      const imagePath = path.join(folder, subfolder1, productImageName);

      if (fs.existsSync(imagePath)) {
        return imagePath;
      }
    }
  }
  return false;
};

export { addProductImages, addVariantImages };
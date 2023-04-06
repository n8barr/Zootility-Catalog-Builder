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
  }
  
  // Check for and add the Packaging image
  const packagingImagePath = getAdditionalImagePath(product, packagingFolder);

  // Add the images in the desired order (packaging image is second, even if no lifestyle image)
  if (!packagingImagePath && lifestyleImagePath) {
    product.images.unshift(lifestyleImagePath);
  } else if (packagingImagePath && lifestyleImagePath) {
    product.images.unshift(packagingImagePath);
    product.images.unshift(lifestyleImagePath);
  } else if (packagingImagePath && !lifestyleImagePath) {
    product.images.splice(1, 0, packagingImagePath);
  }
};

function getAdditionalImagePath(product, folder) {
  const [subfolder1, subfolder2] = product.sku.split('-');
  const baseProductSku = `${subfolder1}-${subfolder2}`;

  for (const ext of extensions) {
    const productImageName = baseProductSku + ext;
    const imagePath = path.join(folder, subfolder1, productImageName);

    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
  }
  return false;
};

export { addProductImages, addVariantImages };
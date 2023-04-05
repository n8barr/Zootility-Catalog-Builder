import fs from 'fs';
import path from 'path';

function addProductImagePaths(product) {
  const sku = product.sku;
  const [subfolder1, subfolder2] = sku.split('-');
  const basePath = `product_images/${subfolder1}/${subfolder2}`;

  for (let i = 1; i <= 4; i++) {
    const imageFileName = i === 1 ? `${sku}.png` : `${sku}-${i}.png`;
    const imagePath = path.join(basePath, imageFileName);

    if (fs.existsSync(imagePath)) {
      product[`imagePath${i}`] = imagePath;
    }
  }
};

function addLifestyleImagePaths(variant) {
  const extensions = ['.png', '.PNG', '.jpeg', '.JPEG', '.jpg', '.JPG'];

  const [folder, subfolder] = variant.sku.split('-');
  const baseLifestyleImageName = `${folder}-${subfolder}`;

  for (const ext of extensions) {
    const lifestyleImageName = baseLifestyleImageName + ext;
    const lifestyleImagePath = path.join('lifestyle_images', folder, lifestyleImageName);

    if (fs.existsSync(lifestyleImagePath)) {
      variant.lifestyleImage = lifestyleImagePath;
      break;
    }
  }
};

export { addProductImagePaths, addLifestyleImagePaths };
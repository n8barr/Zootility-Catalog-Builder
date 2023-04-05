import { addProductImagePaths, addLifestyleImagePaths } from "./addImagePaths.js";

function groupProductsWithVariants(products) {
    const productsByName = {};
  
    products.forEach((product) => {
      const productName = product.productName;
      const variant = {
        sku: product.sku,
        'option1Value': product.option1Value,
        'option2Value': product.option2Value
      };

      addProductImagePaths(variant);
      addLifestyleImagePaths(variant);

      if (!productsByName[productName]) {
        productsByName[productName] = {
          ...product,
          imagePath1: variant.lifestyleImage || variant.imagePath1,
          imageType: variant.lifestyleImage ? 'lifestyle' : 'product',
          variants: [],
        };
      }
  
      productsByName[productName].variants.push(variant);
    });
  
    const productsWithVariants = Object.values(productsByName);
    return productsWithVariants;
};   

export { groupProductsWithVariants };
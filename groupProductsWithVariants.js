import { addProductImages, addVariantImages } from "./addImagePaths.js";
import { sortProducts } from "./sortProducts.js";

function groupProductsWithVariants(products) {
    const productsByName = {};
  
    products.forEach((product) => {
      const productName = product.productName;
      const variant = {
        sku: product.sku,
        'option1Value': product.option1Value,
        'option2Value': product.option2Value,
        images: []
      };

      addVariantImages(variant);

      if (!productsByName[productName]) {
        addProductImages(product);
        
        product.productDescription = shortenDescription(product.productDescription);
        product.productDescription = removeHTMLSpans(product.productDescription);
        product.productDescription = cropAtBreak(product.productDescription);

        const [subfolder1, subfolder2] = product.sku.split('-');
        const baseSku = `${subfolder1}-${subfolder2}`;
        const use1x2Grid = false;

        // set a flag if the product image is the header image and is a jpg
        const jpgRegex = /\.(jpg|jpeg)$/i;
        if (!product.hasJpgLifestyleImage && jpgRegex.test(variant.images[0])) {
          product.hasJpgImage = true;
        }
    
        productsByName[productName] = {
          ...product,
          baseSku,
          use1x2Grid,
          variants: [],
        };
      }
  
      productsByName[productName].variants.push(variant);
    });
  
    const productsWithVariants = Object.values(productsByName);
    const sortedProducts = sortProducts(productsWithVariants);
    return sortedProducts;
};   

function shortenDescription(description) {
  const regex = /<p>(.*?)<\/p>/;
  const matches = description.match(regex);
  const firstParagraph = matches && matches[1];
  return firstParagraph || description;
}

function removeHTMLSpans(html) {
  const regex = /<\/?span[^>]*>/gi;
  const result = html.replace(regex, '');
  return result;
}

function cropAtBreak(inputString) {
  const regex = /<br\s*\/?>/;
  const trimmedString = inputString.split(regex)[0];
  return trimmedString;
}

export { groupProductsWithVariants };
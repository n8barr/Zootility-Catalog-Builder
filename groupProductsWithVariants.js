import { addProductImages, addVariantImages } from "./addImagePaths.js";

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
        const [subfolder1, subfolder2] = product.sku.split('-');
        const baseSku = `${subfolder1}-${subfolder2}`;
    
        productsByName[productName] = {
          ...product,
          baseSku,
          variants: [],
        };
      }
  
      productsByName[productName].variants.push(variant);
    });
  
    const productsWithVariants = Object.values(productsByName);
    return productsWithVariants;
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

export { groupProductsWithVariants };
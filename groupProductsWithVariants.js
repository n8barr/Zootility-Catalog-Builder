import { addProductImages, addVariantImages } from "./addImagePaths.js";
import { sortProducts } from "./sortProducts.js";
import checkForOnlineImage from "./checkForOnlineImage.js";

async function groupProductsWithVariants(products, config) {
  const collections = config.collections;
  const productsByName = {};

  for (const product of products) {
    const productName = product.productName;
    const wholesalePrice = parseFloat(product.wholesalePrice);
    const retailPrice = parseFloat(product.retailPrice);
    const variant = {
      sku: product.sku,
      wholesalePrice: wholesalePrice.toFixed(2),
      retailPrice: retailPrice.toFixed(2),
      option1Value: product.option1Value,
      option2Value: product.option2Value,
      barcode: product.barcode,
      onlineVariantImgUrl: product.variantImage,
      onlineProductImgUrl: product.productImage,
      images: [],
      showBarcodes: config.showBarcodes,
    };

    try {
      await addVariantImages(variant, config.type);
    } catch (error) {
      debugger;
    }

    if (!productsByName[productName]) {
      addProductImages(product, config.type);

      // if no variant image was found, check for the product image online
      if (variant.images.length === 0) {
        const onlineImgUrl = variant.onlineProductImgUrl;
        const imageFound = await checkForOnlineImage(onlineImgUrl, config.type);
        if (imageFound) {
          variant.images.push(imageFound);
        }
      }

      product.productDescription = shortenDescription(
        product.productDescription
      );
      product.productDescription = removeHTMLSpans(product.productDescription);
      product.productDescription = cropAtBreak(product.productDescription);

      const [subfolder1, subfolder2] = product.sku.split("-");
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
        minRetailPrice: retailPrice.toFixed(2),
        maxRetailPrice: retailPrice.toFixed(2),
        minWholesalePrice: wholesalePrice.toFixed(2),
        maxWholesalePrice: wholesalePrice.toFixed(2),
      };
    }
    const productsByNameRetailPrice = parseFloat(
      productsByName[productName].retailPrice
    );
    const productsByNameWholesalePrice = parseFloat(
      productsByName[productName].wholesalePrice
    );
    const productsByNameMinRetailPrice = parseFloat(
      productsByName[productName].minRetailPrice
    );
    const productsByNameMaxRetailPrice = parseFloat(
      productsByName[productName].maxRetailPrice
    );
    const productsByNameMinWholesalePrice = parseFloat(
      productsByName[productName].minWholesalePrice
    );
    const productsByNameMaxWholesalePrice = parseFloat(
      productsByName[productName].maxWholesalePrice
    );
    // check if this variant has a different price than the product
    if (retailPrice !== productsByNameRetailPrice) {
      // if the variant price is higher, set the max price on the productsByName, otherwise set the min price
      if (retailPrice > productsByNameRetailPrice) {
        if (retailPrice > productsByNameMaxRetailPrice) {
          productsByName[productName].maxRetailPrice =
            parseFloat(retailPrice).toFixed(2);
        }
      } else if (retailPrice < productsByNameMinRetailPrice) {
        productsByName[productName].minRetailPrice =
          parseFloat(retailPrice).toFixed(2);
      }
    }

    // check if this variant has a different price than the product
    if (wholesalePrice !== productsByNameWholesalePrice) {
      // if the variant price is higher, set the max price on the productsByName, otherwise set the min price
      if (wholesalePrice > productsByNameWholesalePrice) {
        if (wholesalePrice > productsByNameMaxWholesalePrice) {
          productsByName[productName].maxWholesalePrice =
            parseFloat(wholesalePrice).toFixed(2);
        }
      } else if (wholesalePrice < productsByNameMinWholesalePrice) {
        productsByName[productName].minWholesalePrice =
          parseFloat(wholesalePrice).toFixed(2);
      }
    }

    productsByName[productName].variants.push(variant);
  }

  const productsWithVariants = Object.values(productsByName);
  const sortedProducts = sortProducts(productsWithVariants, collections);
  return sortedProducts;
}

// Regex string to match contents of html paragraph tags
const regex = /<p[^>]*>([^<]+)<\/p>/;

function shortenDescription(description) {
  const matches = description.match(regex);
  const firstParagraph = matches && matches[1];
  return firstParagraph || description;
}

function removeHTMLSpans(html) {
  const regex = /<\/?span[^>]*>/gi;
  const result = html.replace(regex, "");
  return result;
}

function cropAtBreak(inputString) {
  const regex = /<br\s*\/?>/;
  const trimmedString = inputString.split(regex)[0];
  return trimmedString;
}

export { groupProductsWithVariants };

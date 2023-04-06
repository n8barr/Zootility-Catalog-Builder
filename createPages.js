import { compiledProductLeftTemplates, compiledProductRightTemplates, compiledVariantTemplate } from "./compileTemplates.js";
import { bgTemplate } from "./staticTemplate.js";

// Global variables for this module
let pageIndex = 1;
let pageSections = [];
let collectionName;
const pages = [];

// Create pages from the product list
function createPages(productsWithVariants) {

  // Build the page sections list
  productsWithVariants.forEach((product, index) => {
    generatePageSections(product);
  });

  if (pageSections.length === 1) {
    insertPage();
  }

  return pages;
}
  
//split a product into the number of needed page sections
function generatePageSections(product) {
  const variantsCount = product.variants.length;

  if (variantsCount === 1 || variantsCount >= 6) {
      pageSections.push({
          content: selectTemplate(0)(product),
          collectionName: product.productType
      });
      checkInsertPage();
      // remove that variant from the array
      // product.variants.shift();
  }

  if (variantsCount >= 2 && variantsCount <= 5) {
      // Render variant templates and add them to the product object
      product.variants.forEach((variant) => {
          variant.variantTemplate = compiledVariantTemplate(variant);
      });

      pageSections.push({
          content: selectTemplate(1)(product),
          collectionName: product.productType
      });
      checkInsertPage();
  } else if (variantsCount >= 6) {
    while (product.variants.length > 0) {
      const subVariants = product.variants.splice(0, 12);
      const subProduct = { ...product, variants: subVariants };
      pageSections.push({
          content: selectTemplate(2)(subProduct),
          collectionName: product.productType
      });
      checkInsertPage();
    }
  }

  return;
}

// 
function selectTemplate(version) {
  let selectedTemplate;

  //determine if the product-image content should be on the right or left of the page
  if (pageIndex % 2 === 1) {
    selectedTemplate = compiledProductLeftTemplates[version];
  } else {
    selectedTemplate = compiledProductRightTemplates[version];
  }

  return selectedTemplate;
}

function checkInsertPage() {
  if (pageSections.length === 2) {
    insertPage();
  }
}

function insertPage() {
  const content = pageSections[0].content + '\n' + (pageSections[1] && pageSections[1].content);
  const collectionName = pageSections[0].collectionName;
  const page = {
    collectionName,
    content,
    page: pageIndex
  };
  pages.push(page);

  //update the utility variables
  pageIndex++;
  pageSections = [];
}

export { createPages };
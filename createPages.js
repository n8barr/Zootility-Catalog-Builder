import fs from 'fs';
import path from 'path';
import { compiledProductLeftTemplates, 
  compiledProductRightTemplates, 
  compiledVariantTemplate, 
  compiledProduct1ImageTemplate, 
  compiledSectionFillerTemplate 
} from "./compileTemplates.js";
import { bgTemplate } from "./staticTemplate.js";

// Constants for the insertSectionFiller function
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.jpeg', '.JPEG', '.JPG'];
const COLLECTION_FOLDER = 'build/collection_images';

// Global variables for this module
let pageIndex = 1;
let pageSections = [];
let collectionName;
const pages = [];
const collectionSectionFillerCounter = {};

// Create pages from the product list
function createPages(productsWithVariants) {

  // Build the pages in order of the product entries
  let lastProduct;
  productsWithVariants.forEach((product, index) => {
    // Check for a transition from one Collection to another.
    if (pageSections.length === 1 && product.productType !== pageSections[0].collectionName) {
      insertFillerSection(lastProduct);
    }
    // Set this for the next Insert Filler Check
    lastProduct = product;

    // Generate the page sections for the product
    generatePageSections(product);
  });

  // Fill to the end of the page if needed
  if (pageSections.length === 1) {
    insertFillerSection(lastProduct);
  }

  return pages;
}

//split a product into the number of needed page sections
function generatePageSections(product) {
  const variantsCount = product.variants.length;

  // Don't split a product over multiple pages
  // If a pageSection is started, put a two-section product on the next page
  if (pageSections.length === 1 && variantsCount >= 8) {
    insertFillerSection(product);
  }

  // only use the product images in the thumbnail positions on productTemplate1
  if (variantsCount === 1 || variantsCount >= 8 || (variantsCount === 7 && product.hasLifestyleImage)) {
    product.imageTemplates = [];
    product.images.forEach((image, index) => {
      if (product.hasLifestyleImage && index === 0) {
        // don't show the lifestyle image twice
        return;
      }
      product.imageTemplates.push(compiledProduct1ImageTemplate(image));
    });

    // add the variant images to the grid images 
    if (variantsCount === 1) {
      product.variants[0].images.forEach((image, index) => {
        if (index === 0 && !product.hasLifestyleImage) return; // Only add first image if the product has a lifestyle image
        product.imageTemplates.push(compiledProduct1ImageTemplate(image));
      });
    }

    // use the 1x2 grid if there are 2 or less images
    if (product.imageTemplates.length <= 2) {
      product.use1x2Grid = true;
    }

    pageSections.push({
        content: selectTemplate(0)(product),
        collectionName: product.productType
    });
    checkInsertPage();
    // Handle the case where the first variant image is shown as the product image
    // Remove it after the content for the first section has been generated
    if (variantsCount >= 2 && !product.hasLifestyleImage) {
      product.variants.shift();
    }
  }

  if ((variantsCount >= 2 && variantsCount <= 4) || (variantsCount === 5 && !product.hasLifestyleImage)) {
      // Render variant templates and add them to the product object
      product.variants.forEach((variant) => {
          variant.variantTemplate = compiledVariantTemplate(variant);
      });

      if ((variantsCount <= 2) || (!product.hasLifestyleImage && variantsCount === 3)) {
        product.use1x2Grid = true;
      }

      pageSections.push({
          content: selectTemplate(1)(product),
          collectionName: product.productType
      });

      checkInsertPage();

  } else if ((variantsCount >= 5 && variantsCount <= 6) || (variantsCount === 7 && !product.hasLifestyleImage)){
    // Render variant templates and add them to the product object
    product.variants.forEach((variant) => {
      variant.variantTemplate = compiledVariantTemplate(variant);
    });

    pageSections.push({
      content: selectTemplate(1)(product),
      collectionName: product.productType
    });

    checkInsertPage();
  } else if ((variantsCount >= 7 && variantsCount <= 8) || (variantsCount === 9 && !product.hasLifestyleImage)) {
    while (product.variants.length > 0) {
      const subVariants = product.variants.splice(0, 8);
      subVariants.forEach((variant) => {
        variant.variantTemplate = compiledVariantTemplate(variant);
      });
      const subProduct = { ...product, variants: subVariants };
      pageSections.push({
          content: selectTemplate(2)(subProduct),
          collectionName: product.productType
      });
      checkInsertPage();
    }
  } else if (variantsCount >= 9) {
    while (product.variants.length > 0) {
      const subVariants = product.variants.splice(0, 18);
      subVariants.forEach((variant) => {
        variant.variantTemplate = compiledVariantTemplate(variant);
      });
      const subProduct = { ...product, variants: subVariants };
      pageSections.push({
          content: selectTemplate(3)(subProduct),
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

function insertFillerSection(product) {
  const [collectionPrefix] = product.baseSku.split('-');

  // Create an entry if the collection is not in the counter array yet
  if (!collectionSectionFillerCounter.hasOwnProperty(collectionPrefix)) {
    collectionSectionFillerCounter[collectionPrefix] = 1;
  } else {
    // Increment the existing counter
    collectionSectionFillerCounter[collectionPrefix]++;
  }

  const count = collectionSectionFillerCounter[collectionPrefix];
  let foundFillerImagePath = '';

  // Insert a filler section if an image exsists for the collection and counter
  for (const ext of EXTENSIONS) {
    const imageFileName = count === 1 ? `${collectionPrefix}${ext}` : `${collectionPrefix}-${count}${ext}`;
    const fillerImagePath = path.join(COLLECTION_FOLDER, imageFileName);
    if (fs.existsSync(fillerImagePath)) {
      foundFillerImagePath = fillerImagePath;
      break;
    }
  }

  // Generate the content to add the section
  pageSections.push({
    content: compiledSectionFillerTemplate({
      image: foundFillerImagePath,
      class: `filler-${collectionPrefix}-${count}`
    }),
    collectionName: product.productType
  });

  checkInsertPage();

}

export { createPages };
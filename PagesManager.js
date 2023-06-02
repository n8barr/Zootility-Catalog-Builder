import { compiledProductLeftTemplates, 
  compiledProductRightTemplates, 
  compiledVariantTemplate, 
  compiledVariantTemplateWithPrice,
  compiledProduct1ImageTemplate, 
  compiledSectionFillerTemplate,
} from "./compileTemplates.js";

import { FindImagePathManager } from "./FindImagePathManager.js";

import { buildCollectionSummary } from "./buildCollectionSummary.js";

class PagesManager {
  constructor(config) {
    // Set variables for this module
    this.config = config;
    this.pageIndex = 1;
    this.pageSections = [];
    this.pages = [];
  }

  // Create pages from the product list
  createPages(productsWithVariants, catalogStyle) {

    // Build the pages in order of the product entries
    let lastProduct = {};
    productsWithVariants.forEach((product, index) => {
      const collectionName = product.productType;
      // Check for a transition from one Collection to another.
      if (this.pageSections.length === 1 && collectionName !== this.pageSections[0].collectionName) {
        // Add filler section if page is only half full
          this.insertFillerSection(lastProduct, catalogStyle);
      }

      // Check if the lastProduct is a different collection than the current
      if (collectionName !== lastProduct.productType) {
        // Add a collection contents summary page to the start of a 
        // new section

        // First Return a list of products in the collection
        const collectionProducts = productsWithVariants.filter((product) => {
          return product.productType === collectionName;
        });

        const collectionSummaryPage = buildCollectionSummary(product, collectionProducts, catalogStyle);
        
        this.insertPage(collectionSummaryPage, "MADE IN USA");
      }
      // Set this for the next Insert Filler Check
      lastProduct = product;

      // Generate the page sections for the product
      this.generatePageSections(product, catalogStyle);
    });

    // Fill to the end of the page if needed
    if (this.pageSections.length === 1) {
      this.insertFillerSection(lastProduct, catalogStyle);
    }

    return this.pages;
  }


  //split a product into the number of needed page sections
  generatePageSections(product, catalogStyle) {
    const variantsCount = product.variants.length;

    // Don't split a product over multiple pages
    // If a pageSection is started, put a two-section product on the next page
    if (this.pageSections.length === 1 && (variantsCount >= 8 || (variantsCount === 7 && product.hasLifestyleImage))) {
      this.insertFillerSection(product, catalogStyle);
    }

    // Check if the product needs a price range
    let hasPriceRange = false;
    if (product.minRetailPrice !== product.maxRetailPrice) {
      hasPriceRange = true;
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

      // set the showSkuInOverview flag
      product.showSkuInOverview = variantsCount === 1 ? true : !product.hasLifestyleImage;

      // use the 1x2 grid if there are 2 or less images
      if (product.imageTemplates.length <= 2) {
        product.use1x2Grid = true;
      }
      const content = this.selectTemplate(0)({ 
        ...product, 
        showBarcodes: this.config.showBarcodes 
      });
      this.pageSections.push({
          content,
          collectionName: product.productType
      });
      this.checkInsertPage();
      // Handle the case where the first variant image is shown as the product image
      // Remove it after the content for the first section has been generated
      if (variantsCount >= 2 && !product.hasLifestyleImage) {
        product.variants.shift();
      }
    }

    if ((variantsCount >= 2 && variantsCount <= 4) || (variantsCount === 5 && !product.hasLifestyleImage)) {
        // Render variant templates and add them to the product object
        product.variants.forEach((variant) => {
            variant.variantTemplate = hasPriceRange ? compiledVariantTemplateWithPrice(variant) : compiledVariantTemplate(variant);
        });

        if ((variantsCount <= 2) || (!product.hasLifestyleImage && variantsCount === 3)) {
          product.use1x2Grid = true;
        }

        const content = this.selectTemplate(1)({ 
          ...product, 
          showBarcodes: this.config.showBarcodes 
        });
        this.pageSections.push({
            content,
            collectionName: product.productType
          });

        this.checkInsertPage();

    } else if ((variantsCount >= 5 && variantsCount <= 6) || (variantsCount === 7 && !product.hasLifestyleImage)){
      // Render variant templates and add them to the product object
      product.variants.forEach((variant) => {
        variant.variantTemplate = hasPriceRange ? compiledVariantTemplateWithPrice(variant) : compiledVariantTemplate(variant);
      });

      const content = this.selectTemplate(1)({ 
        ...product, 
        showBarcodes: this.config.showBarcodes 
      });
      this.pageSections.push({
        content,
        collectionName: product.productType
      });

      this.checkInsertPage();
    } else if ((variantsCount >= 7 && variantsCount <= 8) || (variantsCount === 9 && !product.hasLifestyleImage)) {
      while (product.variants.length > 0) {
        const subVariants = product.variants.splice(0, 8);
        subVariants.forEach((variant) => {
          variant.variantTemplate = hasPriceRange ? compiledVariantTemplateWithPrice(variant) : compiledVariantTemplate(variant);
        });
        const subProduct = { ...product, variants: subVariants };
        const content = this.selectTemplate(2)({ 
          ...subProduct, 
          showBarcodes: this.config.showBarcodes 
        });
        this.pageSections.push({
            content,
            collectionName: product.productType
        });
        this.checkInsertPage();
      }
    } else if (variantsCount >= 9) {
      while (product.variants.length > 0) {
        const subVariants = product.variants.splice(0, 18);
        subVariants.forEach((variant) => {
          variant.variantTemplate = hasPriceRange ? compiledVariantTemplateWithPrice(variant) : compiledVariantTemplate(variant);
        });
        const subProduct = { ...product, variants: subVariants };
        const content = this.selectTemplate(3)({ 
          ...subProduct, 
          showBarcodes: this.config.showBarcodes 
        });
        this.pageSections.push({
            content,
            collectionName: product.productType
        });
        this.checkInsertPage();
      }
    }

    return;
  }

  selectTemplate(version) {
    let selectedTemplate;

    //determine if the product-image content should be on the right or left of the page
    if (this.pageIndex % 2 === 1) {
      selectedTemplate = compiledProductLeftTemplates[version];
    } else {
      selectedTemplate = compiledProductRightTemplates[version];
    }

    return selectedTemplate;
  }

  checkInsertPage() {
    if (this.pageSections.length === 2) {
      this.insertPageSections();
    }
  }

  insertPageSections() {
    const content = this.pageSections[0].content + '\n' + (this.pageSections[1] && this.pageSections[1].content);
    const collectionName = this.pageSections[0].collectionName;
    this.insertPage(content, collectionName);
  }

  insertPage(content, collectionName) {
    const page = {
      collectionName,
      content,
      page: this.pageIndex
    };
    this.pages.push(page);

    //update the utility variables
    this.pageIndex++;
    this.pageSections = [];
  }

  insertFillerSection(product, catalogStyle) {
    const [collectionPrefix] = product.baseSku.split('-');

    const { imagePath, count } = FindImagePathManager.findCollectionImage(collectionPrefix, catalogStyle);

    // Generate the content to add the section
    this.pageSections.push({
      content: compiledSectionFillerTemplate({
        image: imagePath,
        class: `filler-${collectionPrefix}-${count}`
      }),
      collectionName: product.productType
    });

    this.checkInsertPage();

  }
}

export { PagesManager };
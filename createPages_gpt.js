import {
    compiledProductLeftTemplates,
    compiledProductRightTemplates,
    compiledVariantTemplate,
    compiledProduct1ImageTemplate,
  } from "./compileTemplates.js";
  import { bgTemplate } from "./staticTemplate.js";
  
  // Global variables for this module
  let pageIndex = 1;
  let pageSections = [];
  const pages = [];
  
  // Create pages from the product list
  function createPages(productsWithVariants) {
    // Build the page sections list
    productsWithVariants.forEach(generatePageSections);
  
    if (pageSections.length === 1) {
      insertPage();
    }
  
    return pages;
  }
  
  // Split a product into the number of needed page sections
  function generatePageSections(product) {
    const variantsCount = product.variants.length;
  
    // Generate image templates for products with 1 or 7+ variants
    if (
      variantsCount === 1 ||
      variantsCount >= 8 ||
      (variantsCount === 7 && product.hasLifestyleImage)
    ) {
      product.imageTemplates = generateImageTemplates(product);
      product.use1x2Grid = product.imageTemplates.length <= 2;
  
      pageSections.push({
        content: selectTemplate(0)(product),
        collectionName: product.type,
      });
  
      checkInsertPage();
    }
  
    // Generate variant templates for products with 2-4 variants, or 5 variants without lifestyle image
    if (
      (variantsCount >= 2 && variantsCount <= 4) ||
      (variantsCount === 5 && !product.hasLifestyleImage)
    ) {
      addVariantTemplates(product, 1);
    }
  
    // Generate variant templates for products with 5-6 variants, or 7 variants without lifestyle image
    if (
      (variantsCount >= 5 && variantsCount <= 6) ||
      (variantsCount === 7 && !product.hasLifestyleImage)
    ) {
      addVariantTemplates(product, 1);
    }
  
    // Generate variant templates for products with 7-8 variants, or 9 variants without lifestyle image
    if (
      (variantsCount >= 7 && variantsCount <= 8) ||
      (variantsCount === 9 && !product.hasLifestyleImage)
    ) {
      addVariantTemplates(product, 2, 8);
    }
  
    // Generate variant templates for products with 9+ variants
    if (variantsCount >= 9) {
      addVariantTemplates(product, 3, 18);
    }
  
    return;
  }
  
  // Generate image templates for a product
  function generateImageTemplates(product) {
    return product.images
      .filter((_, index) => !(product.hasLifestyleImage && index === 0))
      .map(compiledProduct1ImageTemplate);
  }
  
  // Add variant templates for a product
  function addVariantTemplates(product, templateIndex, maxVariants) {
    let subVariants = product.variants;
  
    if (maxVariants) {
      subVariants = product.variants.splice(0, maxVariants);
    }
  
    subVariants.forEach(
      (variant) => (variant.variantTemplate = compiledVariantTemplate(variant))
    );
  
    if (product.hasLifestyleImage || !product.imageTemplates) {
      product.use1x2Grid = true;
    }
  
    pageSections.push({
      content: selectTemplate(templateIndex)({
        ...product,
        variants: subVariants,
      }),
      collectionName: product.type,
    });
  
    checkInsertPage();
  }
  
  // Select a template
  function selectTemplate(version) {
    // Determine if the product-image content should be
  
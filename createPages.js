import { compiledProductTemplates, compiledProductLifestyleTemplates, compiledVariantTemplate } from "./compileTemplates.js";

// Create pages from the product list
function createPages(productsWithVariants) {
    const pages = [];
    let pageIndex = 1
  
    //build the page sections list
    let pageSections = [];
    productsWithVariants.forEach((product) => {
        const newPageSections = generatePageSections(product);
        pageSections = pageSections.concat(newPageSections);
    });

    //break the page sections into pages
    for (let i = 0; i < pageSections.length; i += 2) {
      const firstPageSection = pageSections[i];
      const secondPageSection = pageSections[i + 1] || null;
  
      const firstPageSectionHtml = firstPageSection.content;
      let secondPageSectionHtml = '';
      if (secondPageSection) {
        secondPageSectionHtml = secondPageSection.content;
      }
  
      const pageContent = firstPageSectionHtml + secondPageSectionHtml;
      const collectionName = firstPageSection.collectionName;
      const page = {
        collectionName,
        content: pageContent,
        page: pageIndex
      };
      pages.push(page);
  
      pageIndex++;
    }
  
    return pages;
  }
  
  //split a product into the number of needed page sections
  function generatePageSections(product) {
    const variantsCount = product.variants.length;
    let pageSections = [];
  
    if (variantsCount === 1 || variantsCount >= 6) {
        //only pass the product with the first variant into the template
        let subProduct = { ...product, variants: product.variants[0] };

        pageSections.push({
            content: compiledProductTemplates[0](subProduct),
            collectionName: product.productType
        });
        //remove that variant from the array
        product.variants.shift();
    }
  
    if (variantsCount >= 2 && variantsCount <= 5) {
        // Render variant templates and add them to the product object
        product.variants.forEach((variant) => {
            variant.variantTemplate = compiledVariantTemplate(variant);
        });

        let content;
        if (product.imageType === 'lifestyle') {
          content = compiledProductLifestyleTemplates[1](product);
        } else {
          content = compiledProductTemplates[1](product);
        }

        pageSections.push({
            content,
            collectionName: product.productType
        });
    } else if (variantsCount >= 6) {
      while (product.variants.length > 0) {
        const subVariants = product.variants.splice(0, 12);
        const subProduct = { ...product, variants: subVariants };
        pageSections.push({
            content: compiledProductTemplates[2](subProduct),
            collectionName: product.productType
        });
      }
    }
  
    return pageSections;
  }
  
  export { createPages };
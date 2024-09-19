import { createObjectCsvWriter } from 'csv-writer';

function generateBrandwiseFile(productsWithVariants) {
  const brandwiseFile = [];

  // Get the current year first day
  // Generates: "1/1/2024" (or whatever the current year is)
  const currentYear = new Date().getFullYear();
  const firstDayOfCurrentYear = new Date(currentYear, 0, 1);
  const formattedDate = firstDayOfCurrentYear.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  productsWithVariants.forEach((product) => {
    // iterate through the variants of the product
    product.variants.forEach((variant) => {

      // create the product name which is the combination of the product name and the variant name(s)
      let productName = product.productName;
      if (variant.option1Value && variant.option1Value !== "Default Title") {
        productName += ` - ${variant.option1Value}`;
      }
      if (variant.option2Value && variant.option2Value !== "Default Title") {
        productName += ` - ${variant.option2Value}`;
      }
      if (variant.option3Value && variant.option3Value !== "Default Title") {
        productName += ` - ${variant.option3Value}`;
      }

      // if the retail price is not a number, set it to zero
      let retailPrice = parseFloat(product.retailPrice || 0);

      // rename the properties in the products array from Shopify
      const brandwiseProduct = {
        "USD Price (if applicable)": variant.wholesalePrice,
        "USD Quantity (if applicable)": product.minimumOrderQuantity,
        "CAD Price (if applicable)": null,
        "CAD Quantity (if applicable)": null,
        "Product SKU": variant.sku,
        "Product Name": productName,
        "Product Status": "Active",
        "USD Order Quantity Increment": product.minimumOrderQuantity,
        "USD Price 2": null,
        "USD QTY 2": null,
        "USD Price 3": null,
        "USD QTY 3": null,
        "USD Price 4": null,
        "USD QTY 4": null,
        "USD Price 5": null,
        "USD QTY 5": null,
        "CAD Price 2": null,
        "CAD QTY 2": null,
        "CAD Price 3": null,
        "CAD QTY 3": null,
        "CAD Price 4": null,
        "CAD QTY 4": null,
        "CAD Price 5": null,
        "CAD QTY 5": null,
        "Top Level Category 1": product.type,
        "Sub Category A": null,
        "Sub Category B": null,
        "Sub Category C": null,
        "Top Level Category 2": null,
        "Sub Category A": null,
        "Sub Category B": null,
        "Sub Category C": null,
        "Top Level Category 3": null,
        "Sub Category A": null,
        "Sub Category B": null,
        "Sub Category C": null,
        "Available Date": formattedDate,
        "Barcode": variant.barcode,
        "Discountable": null,
        "Item Description Long": null,
        "Item Description Short": null,
        "MSRP": retailPrice,
        "Product Line Name": product.type,
        "Product Line Supplier Code": null,
        "Quantity On Hand": 1000,
        "Restricted": null,
        "Unit Of Measure": null
      };

      brandwiseFile.push(brandwiseProduct);
    });
  });

  // Create an array of headers from the keys of the first product
  const headers = Object.keys(brandwiseFile[0]).map(key => ({ id: key, title: key }));

  const csvWriter = createObjectCsvWriter({
    path: 'build/zootility-brandwise-file.csv',
    header: headers
  });

  csvWriter.writeRecords(brandwiseFile)       // returns a promise
      .then(() => {
          console.log('Brandwise file generated successfully!');
      });

  return;
}

export { generateBrandwiseFile };
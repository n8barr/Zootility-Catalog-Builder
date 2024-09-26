import { createObjectCsvWriter } from 'csv-writer';

function generateMTFile(productsWithVariants) {
  const mtFile = [];

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
      // remove "™" if it is in the product name
      productName = productName.replace(/™/g, "");
      // remove "®" if it is in the product name
      productName = productName.replace(/®/g, "");
      
      if (variant.option2Value && variant.option2Value !== "Default Title") {
        productName += ` - ${variant.option2Value}`;
      }
      if (variant.option3Value && variant.option3Value !== "Default Title") {
        productName += ` - ${variant.option3Value}`;
      }

      // if the retail price is not a number, set it to zero
      let retailPrice = parseFloat(product.retailPrice || 0);

      // rename the properties in the products array from Shopify
      const mtProduct = {
        "Name": productName,
        "ItemNumber": variant.sku,
        "UnitPrice": variant.wholesalePrice,
        "MinimumQuantity": product.minimumOrderQuantity,
        "Description": null,
        "UnitQty": null,
        "UnitOfMeasure": null,
        "QuantityIncrement": product.minimumOrderQuantity,
        "ProductCode": variant.barcode,
        "RetailPrice": retailPrice,
        "QtyAvailable": 1000,
        "Height": null,
        "Width": null,
        "Length": null,
        "Size Unit of Measure": null,
        "Weight": null,
        "Weight Unit of Measure": null,
        "Tags": null,
        "CatalogPageNumber": null,
        "CommissionPercent": null,
        "DateIntroduced": null,
        "DefaultCancelDate": null,
        "DefaultShipDate": null,
        "DetailedDescription": null,
        "Discontinued": 0,
        "DiscountStartDate": null,
        "DiscountEndDate": null,
        "DiscountPercent": null,
        "IsAvailable": 1,
        "IsCommissionable": 1,
        "ItemNotes": null,
        "NextAvailableDate": null,
        "NoFurtherDiscountApplied": null,
        "ShowOnWebsite": 1,
        "UPC2": null,
        "PriceCodeA": null,
        "PriceCodeB": null,
        "PriceCodeC": null,
        "Price Structure Quantity 1": null,
        "Price Structure Price 1": null,
        "Price Structure Quantity 2": null,
        "Price Structure Price 2": null,
        "Price Structure Quantity 3": null,
        "Price Structure Price 3": null,
        "Parent Item": null,
        "SizeColorStyle": null,
        "Top Level Category 1": product.type,
        "Sub Category 1A": null,
        "Sub Category 1B": null,
        "Sub Category 1C": null,
        "Top Level Category 2": null,
        "Sub Category 2A": null,
        "Sub Category 2B": null,
        "Sub Category 2C": null,
        "Top Level Category 3": null,
        "Sub Category 3A": null,
        "Sub Category 3B": null,
        "Sub Category 3C": null,
        "Product Line": product.type,
      };

      mtFile.push(mtProduct);
    });
  });

  // Create an array of headers from the keys of the first product
  const headers = Object.keys(mtFile[0]).map(key => ({ id: key, title: key }));

  const csvWriter = createObjectCsvWriter({
    path: 'build/zootility-mt-file.csv',
    header: headers
  });

  csvWriter.writeRecords(mtFile)       // returns a promise
      .then(() => {
          console.log('MT file generated successfully!');
      });

  return;
}

export { generateMTFile };
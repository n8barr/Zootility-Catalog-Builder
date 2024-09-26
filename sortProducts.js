import fs from "fs";
import { parse } from "./node_modules/csv-parse/lib/sync.js";

// Desired order of products within a product type
const desiredProductOrder = JSON.parse(
  fs.readFileSync("product_order.json", "utf8")
);

// Get the sales totals for each sku
let salesTotals = {};
try {
  // Parse the CSV file and created a salesTotals object
  // e.g., { 'sku1': 100, 'sku2': 50, 'sku3': 200, ... }
  const csvFilePath = "./sales_by_baseSku.csv";
  salesTotals = parseSalesTotalsCSV(csvFilePath);
} catch (error) {
  console.error("Error reading CSV file:", error);
}

// Function to parse the CSV file and create a mapping of SKUs to sales totals
function parseSalesTotalsCSV(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const records = parse(data, { columns: true });
  const salesTotals = {};

  for (const row of records) {
    const { baseSku, sales } = row;
    salesTotals[baseSku] = parseFloat(sales);
  }

  return salesTotals;
}

// Custom sort function
function customProductSort(collections, a, b) {
  const orderA = collections.indexOf(a.type);
  const orderB = collections.indexOf(b.type);

  // Test the type, keep the same product types together
  if (orderA !== orderB) {
    return orderA - orderB;
  }

  // Test the product order override, put the products in the desired order first
  // Check if the product type is in the desired order object as a key
  if (desiredProductOrder[a.type]) {
    // Check if the product is in the desired order array
    const productOrderA = desiredProductOrder[a.type].indexOf(a.baseSku);
    const productOrderB = desiredProductOrder[b.type].indexOf(b.baseSku);
    // If the product is in the desired order array, put it in the desired order
    if (productOrderA === -1 || productOrderB === -1) {
      if (productOrderA === productOrderB) {
        return testVariantSales(a, b);
      }
      if (productOrderA !== -1) {
        return -1;
      }
      return 1;
    }
    if (productOrderA !== productOrderB) {
      return productOrderA - productOrderB;
    }
    return testVariantSales(a, b);
  } // else, continue with the normal sort by sales

  // Test the sales totals, keep the best selling products at the top
  return testVariantSales(a, b);
}

function testVariantSales(a, b) {
  // Test the sales totals, keep the best selling products at the top
  const salesTotalA = salesTotals[a.baseSku] || 0;
  const salesTotalB = salesTotals[b.baseSku] || 0;
  return salesTotalB - salesTotalA;
}

// Custom variant sort function
function customVariantSort(a, b) {
  const option1ValueA = a.option1Value;
  const option1ValueB = b.option1Value;

  if (option1ValueA < option1ValueB) {
    return -1;
  } else if (option1ValueA > option1ValueB) {
    return 1;
  } else {
    // nothing to split them
    return 0;
  }
}

function sortProducts(products, collections) {
  // Sort the products array using the custom sort function and the salesTotals data
  products.sort((a, b) => customProductSort(collections, a, b));

  // Sort the variants array on each product
  products.forEach((product) => {
    product.variants.sort((a, b) => customVariantSort(a, b));
  });

  // Now the products array is sorted by the desired type order and sales total
  return products;
}

export { sortProducts };

import fs from 'fs';
import { parse } from './node_modules/csv-parse/lib/sync.js';

// Desired order of product types
const desiredOrder = JSON.parse(fs.readFileSync('product_type_order.json', 'utf8'));

// Function to parse the CSV file and create a mapping of SKUs to sales totals
function parseSalesTotalsCSV(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const records = parse(data, { columns: true });
  const salesTotals = {};

  for (const row of records) {
    const { baseSku, sales } = row;
    salesTotals[baseSku] = parseFloat(sales);
  }

  return salesTotals;
}

// Custom sort function
function customProductSort(salesTotals, a, b) {
    const orderA = desiredOrder.indexOf(a.productType);
    const orderB = desiredOrder.indexOf(b.productType);
  
    // Test the productType
    if (orderA !== orderB) {
      return orderA - orderB;
    }
  
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
        return 1
    } else { // nothing to split them
        return 0;
    }
}


function sortProducts(products) {
    try {
        // Parse the CSV file and created a salesTotals object
        // e.g., { 'sku1': 100, 'sku2': 50, 'sku3': 200, ... }
        const csvFilePath = './sales_by_baseSku.csv';
        const salesTotals = parseSalesTotalsCSV(csvFilePath);
      
        // Sort the products array using the custom sort function and the salesTotals data
        products.sort((a, b) => customProductSort(salesTotals, a, b));

        // Sort the variants array on each product
        products.forEach(product => {
            product.variants.sort((a, b) => customVariantSort(a, b));
        });
      
    } catch (error) {
        console.error('Error reading CSV file:', error);
    }

    // Now the products array is sorted by the desired productType order and sales total
    return products;
}

export { sortProducts };
import { renameProperties } from './renameProperties.js';
import { filterOnlineOrderingProducts } from './filterOnlineOrderingProducts.js';

// Process the CSV data and create a product list
function processData(csvData) {
  let products = csvData.map(obj => renameProperties(obj));
  const catalogProducts = filterOnlineOrderingProducts(products);
  return catalogProducts;
}

export { processData };
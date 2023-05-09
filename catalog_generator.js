import fs from 'fs';
import csvParser from 'csv-parser';

import { PagesManager } from './PagesManager.js';
import { compiledPageTemplate } from './compileTemplates.js';
import { groupProductsWithVariants } from './groupProductsWithVariants.js';
import { processData } from './processData.js';
import { ConfigReader } from './configReader.js';
import { copyFolderSync } from './copyFolderSync.js';
import { FindImagePathManager } from './FindImagePathManager.js';

// Generate the final HTML
function generateHtml(products, config) {
  const pagesManager = new PagesManager(config);
  const pages = pagesManager.createPages(products);
  return compiledPageTemplate({ 
    pages,
    showBarcodes: config.showBarcodes,
  });
}

// Define the default catalog configuration
const defaultConfig = {
  "name": "Catalog",
  "barcodes": false,
  collections: [
    "Zootility Tools",
    "Rift Collection",
    "WanderMade Wallets",
    "Peak and Port Bags",
    "TūLRY",
    "Timeless Terrain",
    "Definitively Stickers",
    "TechPets",
    "Loopets",
    "Backyard & Bar",
    "Name Drop",
    "State Goods",
    "Displays",
    "Display Packs"
  ]
};

// Create a new instance of the ConfigReader and provide the path to your JSON config file
const configReader = new ConfigReader('./catalog_configurations.json', defaultConfig);

// Get the configurations with the overridden values
const configurations = configReader.getConfigurations();

// Filter products if not in the configuration
const filterProductsByCollections = (products, collections) => {
  return products.filter(product => collections.includes(product.productType));
};

// Read and parse the products CSV file
configurations.forEach((config) => {
  const csvData = [];
  fs.createReadStream('products.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      csvData.push(row);
    })
    .on('end', () => {
      const products = processData(csvData);

      // Generate the HTML for each configuration
        FindImagePathManager.resetCollectionCounterHash();
        const filteredProducts = filterProductsByCollections(products, config.collections);
        const productsWithVariants = groupProductsWithVariants(filteredProducts, config);
        const html = generateHtml(productsWithVariants, config);
        fs.writeFileSync("./app/digital/" + config.name + '.html', html);
        console.log(config.name + ' generated successfully.');
    });
});

// Copy the images and CSS to the app folder
await copyFolderSync('views/css', 'app/css');

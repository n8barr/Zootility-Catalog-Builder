import fs from 'fs';
import path from 'path';

import { PagesManager } from './PagesManager.js';
import { compiledPageTemplate } from './compileTemplates.js';
import { groupProductsWithVariants } from './groupProductsWithVariants.js';
import { processData } from './processData.js';
import { ConfigReader } from './configReader.js';
import { copyFolderSync } from './copyFolderSync.js';
import { FindImagePathManager } from './FindImagePathManager.js';
import { convertHtmlToPdf } from './htmlToPdf.js';
import { defaultConfig, defaultPdfOptions } from './defaultCatalogConfig.js';
import { readCSVSync } from './readCSVSync.js';

// Generate the final HTML
function generateHtml(products, config) {
  const pagesManager = new PagesManager(config);
  const pages = pagesManager.createPages(products, config.type);
  const isDigital = (config.type === 'digital') ? true : false;
  const isPrint = (config.type === 'print' || config.type === 'compressed') ? true : false;
  return compiledPageTemplate({ 
    pages,
    showBarcodes: config.showBarcodes,
    isDigital,
    isPrint
  });
}

// Filter products if not in the configuration
const filterProductsByCollections = (products, collections) => {
  return products.filter(product => collections.includes(product.productType));
};

// Filter products if exlucded in catalog configuration
const filterProductsByExcluded = (products, exclude) => {
  if (exclude === undefined) return products;
  return products.filter(product => !exclude.includes(product.sku));
};

// Run the catalog builder for a single configuration
async function runCatalogBuilderForConfig(config, callback) {
  // Read and parse the products CSV file
  const csvFilePath = './products.csv';
  const csvData = readCSVSync(csvFilePath);
  const products = processData(csvData);

  // Generate the HTML for each configuration
  FindImagePathManager.resetCollectionCounterHash();
  const filteredProducts = filterProductsByCollections(products, config.collections);
  const includedProducts = filterProductsByExcluded(filteredProducts, config.exclude);
  const productsWithVariants = groupProductsWithVariants(includedProducts, config);
  const html = generateHtml(productsWithVariants, config);
  const outputFilePath = './app/' + config.type + '/' + config.name + '.html';
  fs.writeFileSync(outputFilePath, html);

  // Convert the HTML to PDF
  // Set the PDF options with the print of digital options
  // Add the input and output file names
  const pdfOptions = defaultPdfOptions[config.type];
  await convertHtmlToPdf({
    ...pdfOptions,
    inputPath: path.join("./app", config.type, config.name + '.html'),
    outputPath: path.join("./app", config.type, "pdf", config.name + '.pdf'),
  })

  console.log(config.name + ' generated successfully.');
}

// Copy the images and CSS to the app folder
await copyFolderSync('views/css', 'app/css');
// Ensure the compressed/pdf folder exists
fs.mkdirSync('app/compressed/pdf', { recursive: true });
// Ensure the digital/pdf folder exists
fs.mkdirSync('app/digital/pdf', { recursive: true });
// Ensure the print/pdf folder exists
fs.mkdirSync('app/print/pdf', { recursive: true });

// Create a new instance of the ConfigReader and provide the path to your JSON config file
const configReader = new ConfigReader('./catalog_configurations.json', defaultConfig);

// Get the configurations with the overridden values
const configurations = configReader.getConfigurations();


// Run the builder once for print and once for digital
for (const config of configurations) {
  await runCatalogBuilderForConfig({ ...config, type: 'mobile'});
  await runCatalogBuilderForConfig({ ...config, type: 'compressed'});
  await runCatalogBuilderForConfig({ ...config, type: 'digital'});
  await runCatalogBuilderForConfig({ ...config, type: 'print'});
}

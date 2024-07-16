import fs from "fs";
import csvParser from "csv-parser";

import { PagesManager } from "./PagesManager.js";
import { compiledPageTemplate } from "./compileTemplates.js";
import { groupProductsWithVariants } from "./groupProductsWithVariants.js";
import { processData } from "./processData.js";
import { ConfigReader } from "./configReader.js";
import { copyFolderSync } from "./copyFolderSync.js";
import { FindImagePathManager } from "./FindImagePathManager.js";
import { convertHtmlToPdf } from "./htmlToPdf.js";
import { defaultConfig, defaultPdfOptions } from "./defaultCatalogConfig.js";

// Generate the final HTML
function generateHtml(products, config) {
  const pagesManager = new PagesManager(config);
  const pages = pagesManager.createPages(products);
  return compiledPageTemplate({
    pages,
    showBarcodes: config.showBarcodes,
  });
}

// Filter products if not in the configuration
const filterProductsByCollections = (products, collections) => {
  return products.filter((product) => collections.includes(product.type));
};

// Run the catalog builder for a single configuration
function runCatalogBuilderForConfig(config, callback) {
  const csvData = [];

  // Read and parse the products CSV file
  fs.createReadStream("products.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      csvData.push(row);
    })
    .on("end", () => {
      const products = processData(csvData);

      // Generate the HTML for each configuration
      FindImagePathManager.resetCollectionCounterHash();
      const filteredProducts = filterProductsByCollections(
        products,
        config.collections
      );
      const productsWithVariants = groupProductsWithVariants(
        filteredProducts,
        config
      );
      const html = generateHtml(productsWithVariants, config);
      fs.writeFileSync("./app/digital/" + config.name + ".html", html);
      // Convert the HTML to PDF
      // Set the PDF options with the print of digital options
      // Add the input and output file names
      convertHtmlToPdf({
        ...defaultPdfOptions["digital"],
        inputPath: "./app/digital/" + config.name + ".html",
        outputPath: "./app/digital/pdf/" + config.name + ".pdf",
      });
      console.log(config.name + " generated successfully.");
    });
}

// async function runCatalogBuilderWrapper(input) {
//   return await new Promise((resolve, reject) => {
//     runCatalogBuilderForConfig(input, (result) => {
//       resolve(result);

// Copy the images and CSS to the app folder
await copyFolderSync("views/css", "app/css");
await copyFolderSync("views/images", "app/images");
// Ensure the digital/pdf folder exists
fs.mkdirSync("app/digital/pdf", { recursive: true });
// Ensure the print/pdf folder exists
fs.mkdirSync("app/print/pdf", { recursive: true });

// Create a new instance of the ConfigReader and provide the path to your JSON config file
const configReader = new ConfigReader(
  "./catalog_configurations.json",
  defaultConfig
);

// Get the configurations with the overridden values
const configurations = configReader.getConfigurations();

// Run the builder once for print and once for digital
configurations.forEach((config) => {
  runCatalogBuilderForConfig({ ...config, type: "digital" });
  runCatalogBuilderForConfig({ ...config, type: "print" });
});

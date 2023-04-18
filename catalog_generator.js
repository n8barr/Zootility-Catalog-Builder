import fs from 'fs';
import csvParser from 'csv-parser';

import { createPages } from './createPages.js';
import { compiledPageTemplate } from './compileTemplates.js';
import { groupProductsWithVariants } from './groupProductsWithVariants.js';
import { summary_generator } from './summary_generator.js';
import { processData } from './processData.js';

// Prepare the summary JSON file
// summary_generator();

// Read and parse the CSV file
const csvData = [];
fs.createReadStream('products.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    csvData.push(row);
  })
  .on('end', () => {
    const products = processData(csvData);
    const productsWithVariants = groupProductsWithVariants(products);
    const html = generateHtml(productsWithVariants);
    fs.writeFileSync('catalog.html', html);
    console.log('Catalog generated successfully.');
  });

// Generate the final HTML
function generateHtml(products) {
  const pages = createPages(products);
  return compiledPageTemplate({ pages });
}


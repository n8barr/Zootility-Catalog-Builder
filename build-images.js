import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import csvParser from 'csv-parser';
import { processData } from './processData.js';

const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.jpeg', '.JPEG', '.JPG'];
const CSV_FILE_PATH = './products.csv';
const BUILD_BASE_PATH = './build';
const TRIM_OPTIONS = {
    threshold: 1,
};
const CATALOG_TYPES = ['compressed', 'digital', 'print'];

async function readConfiguration() {
    const config = await fs.readJson('build-images-configuration.json');
    return config;
}

function findImagesInFolderStructure(config, identifier) {
    const basePath = config.sourceBasePath;
    let imagePaths = [];
  
    for (let i = 1; i <= 6; i++) {
      for (const ext of SUPPORTED_EXTENSIONS) {
        let imageFileName, imagePath;
        if (config.type === 'collection') {
            const [subfolder1, subfolder2] = identifier.split('-');
            imageFileName = i === 1 ? `${subfolder1}${ext}` : `${subfolder1}-${i}${ext}`;
            imagePath = path.join(basePath, imageFileName);
        } else if (config.type === 'cover' || config.type === 'logo') {
            const collectionName = identifier;
            imageFileName = i === 1 ? `${collectionName}${ext}` : `${collectionName}-${i}${ext}`;
            imagePath = path.join(basePath, imageFileName);
        } else if (config.type === 'product') {
            const [subfolder1, subfolder2] = identifier.split('-');
            imageFileName = i === 1 ? `${subfolder1}-${subfolder2}${ext}` : `${subfolder1}-${subfolder2}-${i}${ext}`;
            imagePath = path.join(basePath, subfolder1, imageFileName);
        } else {
            // Assume type is variant
            const [subfolder1, subfolder2] = identifier.split('-');
            imageFileName = i === 1 ? `${identifier}${ext}` : `${identifier}-${i}${ext}`;
            imagePath = path.join(basePath, subfolder1, subfolder2, imageFileName);
        }
  
        if (fs.existsSync(imagePath)) {
          imagePaths.push(imagePath);
          break;
        }
      }
    }
  
    return imagePaths;
}

async function resizeImages(folder, maxWidth, minHeight) {
    const files = await fs.readdir(folder);
  
    console.log(`Resizing images in ${folder}.`);

    for (const file of files) {
        const filePath = path.join(folder, file);
        const stat = await fs.stat(filePath);
    
        if (stat.isFile()) {
            try {
                const image = sharp(filePath);
                const metadata = await image.metadata();
        
                if (metadata.width > maxWidth || metadata.height > minHeight) {
                    // Scale the image so that the width becomes the maxWidth and the height is scaled proportionally
                    // But if the height becomes less than the minHeight, then scale the image so that the height becomes the minHeight and the width is scaled proportionally
                    const widthScalingFactor = maxWidth / metadata.width;
                    const proposedHeight = metadata.height * widthScalingFactor;
                    let resizedWidth, resizedHeight;
                    if (proposedHeight < minHeight) {
                        const heightScalingFactor = minHeight / metadata.height;
                        resizedWidth = Math.round(metadata.width * heightScalingFactor);
                        resizedHeight = Math.round(metadata.height * heightScalingFactor);
                    } else {
                        resizedWidth = maxWidth;
                        resizedHeight = Math.round(metadata.height * widthScalingFactor);
                    }


                    // const newWidth = Math.min(maxWidth, metadata.width);
                    // const newHeight = Math.max(minHeight, metadata.height);
                    // const scalingFactor = Math.min(newWidth / metadata.width, newHeight / metadata.height);
                    // const resizedWidth = Math.round(metadata.width * scalingFactor);
                    // const resizedHeight = Math.round(metadata.height * scalingFactor);

                    
            
                    await image.resize(resizedWidth, resizedHeight).toBuffer(async function(err, buffer) {
                        if (!err) await fs.writeFile(filePath, buffer);
                    });
                }
            } catch (err) {
                console.log(err + ' for ' + filePath);
            }
        } else if (stat.isDirectory()) {
            await resizeImages(filePath, maxWidth, minHeight);
        }
    }
}

async function trimWhitespace(folder) {
    const files = await fs.readdir(folder);

    console.log(`Trimming whitespace in ${folder}.`);
  
    for (const file of files) {
        const filePath = path.join(folder, file);
        const stat = await fs.stat(filePath);
    
        if (stat.isFile()) {
            await sharp(filePath).trim(TRIM_OPTIONS).toBuffer(async function(err, buffer) {
                if (!err) await fs.writeFile(filePath, buffer);
            });
        } else if (stat.isDirectory()) {
            await trimWhitespace(filePath);
        }
    }
}

async function processCSVFile(csvFilePath) {
    const csvData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
            csvData.push(row);
        })
        .on('end', () => {
            const products = processData(csvData);
            console.log('CSV file processing completed. Found ' + products.length + ' products.');
            resolve(products);
        });
    });
}

async function processProduct(identifier, catalogType, folderConfig) {
    const sourceBasePath = folderConfig.sourceBasePath;
    const destinationBasePath = path.join(BUILD_BASE_PATH, folderConfig.destinationBasePath, catalogType);
    const imagePaths = findImagesInFolderStructure(folderConfig, identifier);

    for (const imagePath of imagePaths) {
        const relativePath = path.relative(sourceBasePath, imagePath);
        const destinationPath = path.join(destinationBasePath, relativePath);
        const destinationFolder = path.dirname(destinationPath);
        await fs.ensureDir(destinationFolder);
        await fs.copy(imagePath, destinationPath);
    }
}
  
  
async function processFolders() {
    const config = await readConfiguration();
    const products = await processCSVFile(CSV_FILE_PATH);
  
    for (const folderConfig of config.folders) {
        console.log('Starting ' + folderConfig.destinationBasePath);

        // Execute for each of the catalog types
        for (const catalogType of CATALOG_TYPES) {
            // Avoid trouble if the destinationBasePath wasn't properly specified
            if (!folderConfig.destinationBasePath || folderConfig.destinationBasePath.length <= 2) break;

            // Remove the destination directory if it exists
            const destinationBasePath = path.join(BUILD_BASE_PATH, folderConfig.destinationBasePath, catalogType);
            await fs.remove(destinationBasePath);

            // Create the destination directory
            await fs.ensureDir(destinationBasePath);

            const componentList = [];
            for (const product of products) {
                const sku = product.sku;

                // Collections don't need to repeat the search for every variant in the collection
                if (folderConfig.type === 'collection') {
                    const regex = /^[^-]+/;
                    const match = sku.match(regex);
                    if (componentList.find(component => component === match[0])) { 
                        // skip
                    } else {
                        componentList.push(match[0]);
                        // Copy the images for each SKU
                        await processProduct(sku, catalogType, folderConfig);
                    }

                // Products don't need to repeat the search for every variant in the prodcut
                } else if (folderConfig.type === 'product') {
                    const regex = /^([^-]+-[^-]+)/;
                    const match = sku.match(regex);
                    if (componentList.find(component => component === match[0])) {
                        // skip
                    } else {
                        componentList.push(match[0]);
                        // Copy the images for each SKU
                        await processProduct(sku, catalogType, folderConfig);
                    }
                    
                } else if (folderConfig.type === 'cover' || folderConfig.type === 'logo') {
                    // Collections don't need to repeat on every variant in the product
                    const collectionName = product.productType;
                    if (componentList.includes(collectionName)) { 
                        // skip
                    } else {
                        componentList.push(componentList);
                        // Copy the images for each Collection
                        await processProduct(collectionName, catalogType, folderConfig);
                    }
                } else {
                    // Copy the images for each SKU
                    await processProduct(sku, catalogType, folderConfig);
                }


            }

            // Trim Whitespace from each image in the destinationBase folder
            if (folderConfig.trimWhitespace) {
                await trimWhitespace(destinationBasePath);
            }
            
            // Resize each image in the destinationBase folder
            const maxWidth = folderConfig[catalogType] && folderConfig[catalogType].maxWidth;
            const minHeight = folderConfig[catalogType] && folderConfig[catalogType].minHeight;

            if (maxWidth && minHeight) {
                await resizeImages(destinationBasePath, maxWidth, minHeight);
            }

            console.log('  Done ' + catalogType);
        }
    }

    // Create the HTML destination directory
    // await fs.ensureDir('build/digital');
    // await fs.ensureDir('build/print');
    // await fs.ensureDir('build/css');
}
  
processFolders().catch(console.error);
  
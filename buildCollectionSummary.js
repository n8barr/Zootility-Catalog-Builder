import fs from 'fs';
import { compiledCollectionSummaryTemplate } from "./compileTemplates.js";
import { FindImagePathManager } from "./FindImagePathManager.js";

// Read the modified_skus.json file and store the skus in an array
const collectionBlurbs = JSON.parse(fs.readFileSync('collection_blurbs.json', 'utf8'));

function buildCollectionSummary(product, collectionProducts) {
  // Get the collection blurb if there is one
  const collectionBlurb = collectionBlurbs[product.productType];

  const collectionName = product.productType;
  let blurb, tagline;

  // Calculate the gradient start and end points
  let gradientStart, gradientEnd;
  if (collectionBlurb) {
    blurb = collectionBlurb.blurb;
    tagline = collectionBlurb.tagline;
    const blurbLength = blurb.length;
    gradientStart = 10 + (Math.round(blurbLength / 50) * 3);
    if (tagline.length) gradientStart += 10;
  } else {
    // Using the number of products in the collection
    gradientStart = collectionProducts.length >= 14 ? 100 : 10 + (collectionProducts.length * 5);
  }
  gradientEnd = 20 + gradientStart;

  // Create the collection summary page using the collectionSummaryTemplate
  const collectionSummaryPage = compiledCollectionSummaryTemplate({
    collectionName,
    gradientStart,
    gradientEnd,
    blurb,
    tagline,
    products: collectionProducts,
    cover: FindImagePathManager.findCoverImage(collectionName),
  });

  return collectionSummaryPage;
}

export { buildCollectionSummary };
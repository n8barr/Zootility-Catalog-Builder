import fs from 'fs';
import path from 'path';

// Constants for the insertSectionFiller function
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.jpeg', '.JPEG', '.JPG'];
const COLLECTION_FOLDER = 'build/collection_images';
const COVER_FOLDER = 'build/cover_images';

const COLLECTION_SECTION_FILLER_COUNTER = {};

function findCollectionImage(prefix) {
  return findImagePath(prefix, COLLECTION_FOLDER);
}

function findCoverImage(collectionName) {
  const { foundFillerImagePath } = findImagePath(collectionName, COVER_FOLDER);
  return foundFillerImagePath;
}

function findImagePath(prefix, folder) {
  let foundFillerImagePath = '';

  const count = getCounter(prefix);

  // Insert a filler section if an image exsists for the collection and counter
  for (const ext of EXTENSIONS) {
    const imageFileName = count === 1 ? `${prefix}${ext}` : `${prefix}-${count}${ext}`;
    const fillerImagePath = path.join(folder, imageFileName);
    if (fs.existsSync(fillerImagePath)) {
      foundFillerImagePath = fillerImagePath;
      break;
    }
  }

  return {
    foundFillerImagePath,
    count
  };
}

function getCounter(collectionPrefix) {
  // Create an entry if the collection is not in the counter array yet
  if (!COLLECTION_SECTION_FILLER_COUNTER.hasOwnProperty(collectionPrefix)) {
    COLLECTION_SECTION_FILLER_COUNTER[collectionPrefix] = 1;
  } else {
    // Increment the existing counter
    COLLECTION_SECTION_FILLER_COUNTER[collectionPrefix]++;
  }

  return COLLECTION_SECTION_FILLER_COUNTER[collectionPrefix];
}

export {
  findCollectionImage,
  findCoverImage
};
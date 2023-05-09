import fs from 'fs';
import path from 'path';

// Constants for the insertSectionFiller function
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.jpeg', '.JPEG', '.JPG'];
const COLLECTION_FOLDER = 'build/collection_images';
const COVER_FOLDER = 'build/cover_images';
const RELATIVE_PATH_TO_BUILD = '../../';

class FindImagePathManager {
  static collectionCounterHash = {};

  static resetCollectionCounterHash() {
    FindImagePathManager.collectionCounterHash = {};
  }

  static findCollectionImage(prefix) {
    return this.#findImagePath(prefix, COLLECTION_FOLDER);
  }

  static findCoverImage(collectionName) {
    const { imagePath } = this.#findImagePath(collectionName, COVER_FOLDER);
    return imagePath;
  }

  static #findImagePath(prefix, folder) {
    let foundFillerImagePath = '';

    const count = this.#getCounter(prefix);

    // Insert a filler section if an image exsists for the collection and counter
    for (const ext of EXTENSIONS) {
      const imageFileName = count === 1 ? `${prefix}${ext}` : `${prefix}-${count}${ext}`;
      const fillerImagePath = path.join(folder, imageFileName);
      if (fs.existsSync(fillerImagePath)) {
        foundFillerImagePath = fillerImagePath;
        break;
      }
    }

    const imagePath = RELATIVE_PATH_TO_BUILD + foundFillerImagePath;

    return {
      imagePath,
      count
    };
  }

  static #getCounter(collectionPrefix) {
    // Create an entry if the collection is not in the counter array yet
    if (!FindImagePathManager.collectionCounterHash.hasOwnProperty(collectionPrefix)) {
      FindImagePathManager.collectionCounterHash[collectionPrefix] = 1;
    } else {
      // Increment the existing counter
      FindImagePathManager.collectionCounterHash[collectionPrefix]++;
    }

    return FindImagePathManager.collectionCounterHash[collectionPrefix];
  }
}

export { FindImagePathManager };
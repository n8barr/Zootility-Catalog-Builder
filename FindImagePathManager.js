import fs from 'fs';
import path from 'path';

// Constants for the insertSectionFiller function
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.jpeg', '.JPEG', '.JPG'];
const COLLECTION_FOLDER = 'build/collection_images';
const COVER_FOLDER = 'build/cover_images';
const LOGO_FOLDER = 'build/logo_images';
const RELATIVE_PATH_TO_BUILD = '../../';

class FindImagePathManager {
  static collectionCounterHash = {};

  static resetCollectionCounterHash() {
    FindImagePathManager.collectionCounterHash = {};
  }

  static findCollectionImage(prefix, catalogStyle) {
    return this.#findImagePathWithCount(prefix, catalogStyle, COLLECTION_FOLDER);
  }

  static findCoverImage(collectionName, catalogStyle) {
    const { imagePath } = this.#findImagePathWithCount(collectionName, catalogStyle, COVER_FOLDER);
    return imagePath;
  }

  static findLogoImage(collectionName, catalogStyle) {
    const imagePath = this.#findImagePath(collectionName, catalogStyle, LOGO_FOLDER);
    return imagePath;
  }

  static #findImagePathWithCount(prefix, catalogStyle, folder) {
    let foundImagePath = '';

    const count = this.#getCounter(prefix);

    // Insert a filler section if an image exsists for the collection and counter
    for (const ext of EXTENSIONS) {
      const imageFileName = count === 1 ? `${prefix}${ext}` : `${prefix}-${count}${ext}`;
      const imagePath = path.join(folder, catalogStyle, imageFileName);
      if (fs.existsSync(imagePath)) {
        foundImagePath = imagePath;
        break;
      }
    }

    if (foundImagePath.length === 0) {
      return {
        imagePath: undefined,
        count: 0
      }
    }

    const imagePath = RELATIVE_PATH_TO_BUILD + foundImagePath;

    return {
      imagePath,
      count
    };
  }

  static #findImagePath(prefix, catalogStyle, folder) {
    let foundImagePath;

    // Insert a filler section if an image exsists for the collection and counter
    for (const ext of EXTENSIONS) {
      const imageFileName = `${prefix}${ext}`;
      const imagePath = path.join(folder, catalogStyle, imageFileName);
      if (fs.existsSync(imagePath)) {
        foundImagePath = imagePath;
        break;
      }
    }

    if (foundImagePath) foundImagePath = RELATIVE_PATH_TO_BUILD + foundImagePath;

    return foundImagePath;
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
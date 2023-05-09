import fsExtra from 'fs-extra';

async function copyFolderSync(source, destination) {
  try {
    // Ensure the destination folder exists
    fsExtra.ensureDirSync(destination);

    // Read the source folder content
    const items = fsExtra.readdirSync(source);

    // Iterate through each item in the source folder
    items.forEach(item => {
      const sourcePath = `${source}/${item}`;
      const destinationPath = `${destination}/${item}`;
      const stat = fsExtra.statSync(sourcePath);

      // If the item is a directory, copy it recursively
      if (stat.isDirectory()) {
        copyFolderSync(sourcePath, destinationPath);
      } else {
        // If the item is a file, copy it to the destination folder
        fsExtra.copyFileSync(sourcePath, destinationPath);
      }
    });
  } catch (error) {
    console.error(`Error while copying folder: ${error.message}`);
  }
}

const sourceFolder = './source_folder';
const destinationFolder = './destination_folder';

export { copyFolderSync };

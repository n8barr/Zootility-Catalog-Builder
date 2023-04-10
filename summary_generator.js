// summary_generator.js
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ignoreFile = '.gptignore';
const outputFile = 'code_summary.json';

const readIgnoreFile = async () => {
    const fileStream = fs.createReadStream(ignoreFile);
    const rl = readline.createInterface({ input: fileStream });
  
    const ignoreList = [];
  
    for await (const line of rl) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith('#')) {
        const fullPath = path.join(process.cwd(), trimmedLine);
        try {
          const stat = await fs.promises.lstat(fullPath);
          if (stat.isFile()) {
            ignoreList.push({ type: 'file', path: trimmedLine });
          } else if (stat.isDirectory()) {
            ignoreList.push({ type: 'folder', path: trimmedLine });
          }
        } catch (error) {
          console.error(`Error processing entry in .gptignore: ${trimmedLine}`);
        }
      }
    }
  
    return ignoreList;
  };
  
  

const generateSummary = async (dir, ignoreList) => {
  const summary = [];

  const shouldBeIgnored = (type, relativePath) => {
    return ignoreList.some(entry => entry.type === type && entry.path === relativePath);
  };

  const walk = async (currentPath) => {
    const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(dir, fullPath);

      if (entry.isFile() && shouldBeIgnored('file', relativePath)) {
        continue;
      } else if (entry.isDirectory() && shouldBeIgnored('folder', relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        console.log("Adding: " + fullPath);
        const contents = await fs.promises.readFile(fullPath, 'utf-8');
        summary.push({
          filePath: relativePath,
          contents,
        });
      }
    }
  };

  await walk(dir);

  return summary;
};


const summary_generator = async () => {
  try {
    const ignoreList = await readIgnoreFile();
    const summary = await generateSummary(process.cwd(), ignoreList);
    await fs.promises.writeFile(outputFile, JSON.stringify(summary, null, 2));

    console.log(`Generated code summary in ${outputFile}`);
  } catch (error) {
    console.error('Error generating code summary:', error.message);
  }
};

export { summary_generator };

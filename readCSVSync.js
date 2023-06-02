import fs from 'fs';
import { parse as parseSync } from 'csv-parse/sync';

export const readCSVSync = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parseSync(fileContent, {
    columns: true, // Set to true if the first row of your CSV contains column headers
    skip_empty_lines: true,
  });
  return records;
};

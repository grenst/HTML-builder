const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');
const { EOL } = require('os');

const sourceFolder = 'secret-folder';
const sourceFolderPath = path.join(__dirname, sourceFolder);
const readOptions = { withFileTypes: true };
const separator = ' - ';

const formatSizeToKB = (bytes, decimalPlaces = 3) =>
  `${(bytes / 1024).toFixed(decimalPlaces)} KB`;

async function logFileDetails(filePath, delimiter) {
  try {
    const fileStats = await fs.stat(filePath);
    const fileName = path.basename(filePath);
    const fileSize = formatSizeToKB(fileStats.size);
    stdout.write(`${fileName}${delimiter}${fileSize}${EOL}`);
  } catch (err) {
    stdout.write(`Error getting file details: ${err.message}${EOL}`);
  }
}

async function logDirectoryFilesInfo(directoryPath, options, delimiter) {
  try {
    const files = await fs.readdir(directoryPath, options);

    for (const file of files) {
      if (file.isFile()) {
        const fullFilePath = path.join(directoryPath, file.name);
        await logFileDetails(fullFilePath, delimiter);
      }
    }
  } catch (err) {
    stdout.write(
      `Error reading directory '${directoryPath}': ${err.message}${EOL}`
    );
  }
}

logDirectoryFilesInfo(sourceFolderPath, readOptions, separator);

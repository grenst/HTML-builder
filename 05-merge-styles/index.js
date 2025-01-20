const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');
const { createWriteStream } = require('fs');
const { EOL } = require('os');

const sourceFolderName = 'styles';
const distFolderName = 'project-dist';
const outputBundleName = 'bundle.css';
const encoding = 'utf-8';
const fileExtension = '.css';

const sourceFolderPath = path.join(__dirname, sourceFolderName);
const distFolderPath = path.join(__dirname, distFolderName);
const outputFilePath = path.join(distFolderPath, outputBundleName);

async function mergeFiles(sourcePath, distPath, extension, encoding) {
  try {
    const outputStream = createWriteStream(distPath, encoding);
    const files = await fs.readdir(sourcePath, { withFileTypes: true });

    const cssFiles = files
      .filter(file => file.isFile() && path.extname(file.name) === extension);

    for (const cssFile of cssFiles) {
      const filePath = path.join(sourcePath, cssFile.name);
      const fileContent = await fs.readFile(filePath, encoding);
      outputStream.write(`${fileContent}${EOL}`);
    }

    stdout.write(`CSS files merged into [${outputBundleName}] successfully!${EOL}`);
  } catch (err) {
    stdout.write(`Error merging files: ${err.message}${EOL}`);
  }
}

async function createCssBundle() {
  try {
    await fs.rm(outputFilePath, { force: true });

    await mergeFiles(sourceFolderPath, outputFilePath, fileExtension, encoding);
  } catch (err) {
    stdout.write(`Error creating CSS bundle: ${err.message}${EOL}`);
  }
}

createCssBundle();

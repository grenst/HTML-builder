const fs = require('fs/promises');
const path = require('path');
const { stdout } = require('process');
const { EOL } = require('os');

const sourceFolder = 'files';
const sourceFolderPath = path.join(__dirname, sourceFolder);
const copyFolderName = `${sourceFolder}-copy`;
const copyFolderPath = path.join(__dirname, copyFolderName);

async function copyFilesToDestination(sourceFolderPath, destinationFolderPath) {
  try {
    const files = await fs.readdir(sourceFolderPath);

    for (const file of files) {
      const sourceFilePath = path.join(sourceFolderPath, file);
      const destinationFilePath = path.join(destinationFolderPath, file);
      await fs.copyFile(sourceFilePath, destinationFilePath);
    }

    stdout.write(`Files copied from [${sourceFolder}] to [${copyFolderName}] successfully!${EOL}`);
  } catch (err) {
    stdout.write(`Error copying files: ${err.message}${EOL}`);
  }
}

async function copyDirectory() {
  try {
    await fs.rm(copyFolderPath, { recursive: true, force: true });
    await fs.mkdir(copyFolderPath, { recursive: true });

    stdout.write(`Folder [${copyFolderName}] created successfully!${EOL}`);

    await copyFilesToDestination(sourceFolderPath, copyFolderPath);
  } catch (err) {
    stdout.write(`Error during directory copy: ${err.message}${EOL}`);
  }
}

copyDirectory();

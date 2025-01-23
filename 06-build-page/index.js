const { stdout } = require('process');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const outputFolderName = 'project-dist';
const assetsFolderName = 'assets';
const stylesFolderName = 'styles';
const cssBundleName = 'style.css';
const outputHtmlFileName = 'index.html';
const templateFileName = 'template.html';
const componentsFolderName = 'components';

const textEncoding = 'utf-8';
const cssExtension = '.css';
const componentExtension = '.html';

const outputFolderPath = path.join(__dirname, outputFolderName);
const assetsFolderPath = path.join(__dirname, assetsFolderName);
const stylesFolderPath = path.join(__dirname, stylesFolderName);
const templateFilePath = path.join(__dirname, templateFileName);
const componentsFolderPath = path.join(__dirname, componentsFolderName);

async function copyAssets(sourceDir, destinationDir) {
  try {
    await fsPromises.rm(destinationDir, { recursive: true, force: true });
    await fsPromises.mkdir(destinationDir, { recursive: true });

    const files = await fsPromises.readdir(sourceDir, { withFileTypes: true });

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      const destinationPath = path.join(destinationDir, file.name);

      if (file.isDirectory()) {
        await copyAssets(sourcePath, destinationPath);
      } else {
        await fsPromises.copyFile(sourcePath, destinationPath);
      }
    }
  } catch (err) {
    stdout.write(`Error copying assets: ${err.message}\n`);
  }
}

async function createCssBundle() {
  try {
    const outputPath = path.join(outputFolderPath, cssBundleName);
    const writeStream = fs.createWriteStream(outputPath, textEncoding);
    
    const files = await fsPromises.readdir(stylesFolderPath);
    const cssFiles = files
      .filter(file => path.extname(file) === cssExtension)
      .sort((a, b) => a.localeCompare(b));

    for (const file of cssFiles) {
      const filePath = path.join(stylesFolderPath, file);
      let content = await fsPromises.readFile(filePath, textEncoding);

      if (content.endsWith('\n')) content = content.slice(0, -1);
      writeStream.write(content + '\n');
    }

    writeStream.end();
    stdout.write('CSS bundle created successfully!\n');
  } catch (err) {
    stdout.write(`Error creating CSS bundle: ${err.message}\n`);
  }
}

async function createHtmlBundle() {
  try {
    let template = await fsPromises.readFile(templateFilePath, textEncoding);
    const components = await fsPromises.readdir(componentsFolderPath);

    for (const file of components) {
      if (path.extname(file) === componentExtension) {
        const name = path.basename(file, componentExtension);
        const content = await fsPromises.readFile(
          path.join(componentsFolderPath, file),
          textEncoding
        );
        template = template.replace(new RegExp(`{{${name}}}`, 'g'), content);
      }
    }

    await fsPromises.writeFile(
      path.join(outputFolderPath, outputHtmlFileName),
      template
    );
    stdout.write('HTML bundle created successfully!\n');
  } catch (err) {
    stdout.write(`Error creating HTML bundle: ${err.message}\n`);
  }
}

async function buildProject() {
  try {
    await fsPromises.rm(outputFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(outputFolderPath, { recursive: true });

    await Promise.all([
      copyAssets(assetsFolderPath, path.join(outputFolderPath, assetsFolderName)),
      createCssBundle(),
      createHtmlBundle()
    ]);

    stdout.write('Project built successfully!\n');
  } catch (err) {
    stdout.write(`Build error: ${err.message}\n`);
  }
}

buildProject();
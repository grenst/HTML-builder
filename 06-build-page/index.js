const { stdout } = require('process');
const { EOL } = require('os');
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

async function copyFiles(sourceDir, destinationDir) {
  try {
    await fsPromises.mkdir(destinationDir, { recursive: true });
    const files = await fsPromises.readdir(sourceDir, { withFileTypes: true });

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      const destinationPath = path.join(destinationDir, file.name);

      if (file.isDirectory()) {
        await copyFiles(sourcePath, destinationPath);
      } else {
        await fsPromises.copyFile(sourcePath, destinationPath);
      }
    }
  } catch (err) {
    stdout.write(`Error copying files: ${err.message}${EOL}`);
  }
}

async function createCssBundle(
  sourceDir,
  outputFilePath,
  fileExtension,
  encoding
) {
  try {
    const writeStream = fs.createWriteStream(outputFilePath, encoding);
    const files = await fsPromises.readdir(sourceDir);

    for (const file of files) {
      if (path.extname(file) === fileExtension) {
        const filePath = path.join(sourceDir, file);
        const fileContent = await fsPromises.readFile(filePath, encoding);
        writeStream.write(`${fileContent}${EOL}`);
      }
    }

    stdout.write('CSS bundle created successfully!' + EOL);
  } catch (err) {
    stdout.write(`Error creating CSS bundle: ${err.message}${EOL}`);
  }
}

async function createHtmlBundle(templatePath, outputHtmlPath, componentsDir) {
  try {
    const templateContent = await fsPromises.readFile(
      templatePath,
      textEncoding
    );

    const components = {};
    const componentFiles = await fsPromises.readdir(componentsDir);

    for (const file of componentFiles) {
      if (path.extname(file) === componentExtension) {
        const componentContent = await fsPromises.readFile(
          path.join(componentsDir, file),
          textEncoding
        );
        components[path.basename(file, componentExtension)] = componentContent;
      }
    }

    let finalHtmlContent = templateContent.toString();
    for (const [name, content] of Object.entries(components)) {
      const componentTag = `{{${name}}}`;
      finalHtmlContent = finalHtmlContent.replace(
        new RegExp(componentTag, 'g'),
        content
      );
    }

    await fsPromises.writeFile(outputHtmlPath, finalHtmlContent);
    stdout.write('HTML bundle created successfully!' + EOL);
  } catch (err) {
    stdout.write(`Error creating HTML bundle: ${err.message}${EOL}`);
  }
}

async function buildProject() {
  try {
    await fsPromises.rm(outputFolderPath, { recursive: true, force: true });
    await fsPromises.mkdir(outputFolderPath, { recursive: true });

    await copyFiles(
      assetsFolderPath,
      path.join(outputFolderPath, assetsFolderName)
    );

    await createCssBundle(
      stylesFolderPath,
      path.join(outputFolderPath, cssBundleName),
      cssExtension,
      textEncoding
    );

    await createHtmlBundle(
      templateFilePath,
      path.join(outputFolderPath, outputHtmlFileName),
      componentsFolderPath
    );

    stdout.write('Project built successfully!' + EOL);
  } catch (err) {
    stdout.write(`Error during building the project: ${err.message}${EOL}`);
  }
}

buildProject();

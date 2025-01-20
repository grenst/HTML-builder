const fs = require('fs');
const path = require('path');

function readFileWithStream(filePath) {
  const stream = fs.createReadStream(filePath, 'utf-8');

  stream.on('data', (chunk) => {
    console.log(chunk);
  });

  stream.on('error', (err) => {
    console.error(`Error reading the file at ${filePath}:`, err);
  });

  stream.on('end', () => {
    console.log('File reading completed.');
  });
}

const filePath = path.join(__dirname, 'text.txt');
readFileWithStream(filePath);

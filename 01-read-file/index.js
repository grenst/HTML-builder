const fs = require('fs/promises');
const path = require('path');

async function readFile() {
  const filePath = path.join(__dirname, 'text.txt');

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    console.log(data);
  } catch (err) {
    console.error('Error reading the file:', err);
  }
}

readFile();

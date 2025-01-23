const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const reader = fs.createReadStream(filePath, 'utf8');

reader.on('data', (chunk) => process.stdout.write(chunk));
reader.on('error', (err) => console.error('Error:', err.message));

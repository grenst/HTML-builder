const fs = require('fs');
const path = require('path');
const process = require('process');

const outputPath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(outputPath, { flags: 'a' });

console.log('Please enter text to write to the file. Type "exit" to quit.');

process.stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input === 'exit') {
    console.log('Exiting...');
    process.exit();
  } else {
    writeStream.write(`${input}\n`);
  }
});

process.on('SIGINT', () => {
  console.log('Exiting...');
  process.exit();
});

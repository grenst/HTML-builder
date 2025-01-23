const fs = require('fs');
const path = require('path');
const readline = require('readline');

const outputPath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(outputPath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Please enter text to write to the file. Type "exit" to quit.');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    gracefulShutdown();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('SIGINT', () => {
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log('\nExiting...');

  writeStream.end(() => {
    rl.close();
    process.exit(0);
  });
}
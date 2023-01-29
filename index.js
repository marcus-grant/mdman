const fs = require('fs');
const process = require('process');
const handler = require('./lib/frontmatter-file-handler');
const fixer = require('./lib/frontmatter-file-fixer');
const linter = require('./lib/frontmatter-file-linter');

const myMain = () => {
  let dirPath;
  if (process.argv.length < 3) {
    process.stderr('You need to provide a directory of markdown files');
    process.exit(2);
  } else {
  // eslint-disable-next-line prefer-destructuring
    dirPath = process.argv[2];
    if (!fs.existsSync(dirPath)) {
      process.stderr('The provided folder path doesnt exist, please provide a valid one');
      process.exit(128);
    }
  }

  const lintResults = handler.checkLintersOnDir(dirPath);
  if (lintResults.length <= 0) {
    process.stdout.write('All files are linted & up to date!');
    process.exit(0);
  }
  process.stdout.write(`Applying these fixes to files in ${dirPath}`);
  lintResults.forEach((result) => {
    const brokenRules = result.rules.map((x) => handler.LINTER_MAP[x].name);
    process.stdout.write(`${result.filePath}: ${brokenRules}`);
  });
  handler.applyAllFixesToFiles(lintResults);
};

if (typeof require !== 'undefined' && require.main === module) myMain();

module.exports = {
  handler,
  fixer,
  linter,
};

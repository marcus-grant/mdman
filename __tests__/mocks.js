const fs = require('fs');
const path = require('path');

export const TESTING_DIR_PATH = path.join(__dirname, 'testing-dir');

export const mkDirTesting = (testingDirPath = TESTING_DIR_PATH) => {
  if (!fs.existsSync(testingDirPath)) {
    fs.mkdirSync(testingDirPath)
  }
};

export const rmDirTesting = (testingDirPath = TESTING_DIR_PATH) => {
  if (fs.existsSync(testingDirPath)) {
    fs.rmdirSync(testingDirPath);
  }
};
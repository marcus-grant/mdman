const fs = require('fs');
const path = require('path');
const process = require('process');

const PROJECT_ROOT_PATH = path.join(__dirname, '..');
const TESTING_DIR_PATH = path.join(PROJECT_ROOT_PATH, '.jest', 'testing-dir');
const MOCK_NOTES_PATH = path.join(PROJECT_ROOT_PATH, '.jest', 'mock-notes');

const mkDirTesting = (testingDirPath = TESTING_DIR_PATH) => {
  if (!fs.existsSync(testingDirPath)) {
    fs.mkdirSync(testingDirPath);
  }
};

const cpMockNotes = (
  mockDirPath = MOCK_NOTES_PATH,
  testingDirPath = TESTING_DIR_PATH
) => {
  if (!fs.existsSync(mockDirPath)) {
    console.error(`Error, mock notes source directory doesn't exist at ${mockDirPath}`);
  } if (!fs.existsSync(testingDirPath)) {
    mkDirTesting(testingDirPath);
  }
  let mockFiles;
  try {
    mockFiles = fs.readdirSync(mockDirPath);
  } catch {
    console.error(`Error in cpMockNotes readdir of ${mockDirPath}`);
    process.exit(129);
  } finally {
    mockFiles.forEach(mockFile => {
      fs.cpSync(
        path.join(MOCK_NOTES_PATH, mockFile),
        path.join(TESTING_DIR_PATH, mockFile),
      );
    });
  }
};

const rmDirTesting = (testingDirPath = TESTING_DIR_PATH) => {
  if (fs.existsSync(testingDirPath)) {
    fs.readdirSync(testingDirPath).forEach((file/*, index*/) => {
      const curPath = path.join(testingDirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
      // recurse
        rmDirTesting(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(testingDirPath);
  }
};

module.exports = {
  PROJECT_ROOT_PATH,
  TESTING_DIR_PATH,
  MOCK_NOTES_PATH,
  mkDirTesting,
  cpMockNotes,
  rmDirTesting,
};

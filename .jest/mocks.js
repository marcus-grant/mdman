const fs = require('fs');
const path = require('path');
const process = require('process');

const TESTING_DIR_PATH = path.join(__dirname, '..', '__tests__', 'testing-dir');
const MOCK_NOTES_PATH = path.join(__dirname, '..', '__tests__', 'mock-notes')

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
    process.err(`Error, mock notes source directory doesn't exist at ${mockDirPath}`);
  } if (!fs.existsSync(testingDirPath)) {
    mkDirTesting(testingDirPath);
  }
  fs.readdir(mockDirPath, (err, mockFiles) => {
    if (err) {
      process.err(`Error listing files in directory ${mockDirPath}`);
      process.exit(128);
    }
    mockFiles.forEach(mockFile => {
      // console.log(`Debug cpMockNotes: Found mock file ${mockFile}`);
      fs.cpSync(
        path.join(MOCK_NOTES_PATH, mockFile),
        path.join(TESTING_DIR_PATH, mockFile),
      );
    });
  });
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
  TESTING_DIR_PATH,
  MOCK_NOTES_PATH,
  mkDirTesting,
  cpMockNotes,
  rmDirTesting,
};

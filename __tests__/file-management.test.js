const fs = require('fs');

const {
  TESTING_DIR_PATH,
  mkDirTesting,
  rmDirTesting,
} = require('./mocks');
const {
  listAllFiles,
  listAllMdFiles,
} = require('../lib/file-management');

beforeAll(() => {
  // Create the directory where tests will run
  // mkDirTesting();
});

describe('file-management.listAllFiles tests', () => {
  test('Testing dir should exist', () => {
    expect(fs.existsSync(TESTING_DIR_PATH));
  });
});
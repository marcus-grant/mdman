const fs = require('fs');
const { join } = require('path');

const {
  PROJECT_ROOT_PATH,
  TESTING_DIR_PATH,
} = require('../.jest/mocks');
const {
  listAllFiles,
  listAllMdFiles,
} = require('../lib/file-management');

// TESTING CONSTS
// common
const EXPECT_HIDDEN_FILE_PATH = join(TESTING_DIR_PATH, '.hidden-text.txt');
const EXPECT_HIDDEN_MD_FILE_PATH = join(TESTING_DIR_PATH, '.hidden-markdown.md');
// listAllFiles()
const EXPECT_ALL_FILES_COUNT = 13;
// listAllMdFiles()
const EXPECT_ALL_MD_FILES_COUNT = 11;

describe('file-management.listAllFiles tests', () => {
  let listAllFilesResults;
  let nonExistPath;
  beforeAll(() => {
    listAllFilesResults = listAllFiles(TESTING_DIR_PATH);
    nonExistPath = join(PROJECT_ROOT_PATH, 'foo', 'bar');
  });

  test('Testing dir should exist', () => {
    expect(fs.existsSync(TESTING_DIR_PATH)).toBeTruthy();
  });

  test('Nonexistent directories should return falsy', () => {
    expect(listAllFiles(nonExistPath)).toBeFalsy();
  });

  test('Check the number of files returned', () => {
    expect(listAllFilesResults.length).toEqual(EXPECT_ALL_FILES_COUNT);
  });

  test('Check all paths are absolute paths containing TESTING_DIR_PATH', () => {
    listAllFilesResults.forEach((fpath) => {
      expect(fpath).toContain(TESTING_DIR_PATH);
    });
  });

  test('Check that hidden files are listed', () => {
    expect(listAllFilesResults).toContain(EXPECT_HIDDEN_FILE_PATH);
    expect(listAllFilesResults).toContain(EXPECT_HIDDEN_MD_FILE_PATH);
  });

  test('Ensure all returned paths actually exist in the filesystem', () => {
    listAllFilesResults.forEach((fpath) => {
      expect(fs.existsSync(fpath)).toBeTruthy();
    });
  });
});

describe('file-management.listAllMdFiles tests', () => {
  let listAllMdFilesResults;
  let nonExistPath;
  beforeAll(() => {
    listAllMdFilesResults = listAllMdFiles(TESTING_DIR_PATH);
    nonExistPath = join(PROJECT_ROOT_PATH, 'foo', 'bar');
  });

  test('Nonexistent directories should return falsy', () => {
    expect(listAllFiles(nonExistPath)).toBeFalsy();
  });

  test('Check the number of files returned', () => {
    expect(listAllMdFilesResults.length).toEqual(EXPECT_ALL_MD_FILES_COUNT);
  });

  test('Check all paths are absolute paths containing TESTING_DIR_PATH', () => {
    listAllMdFilesResults.forEach((fpath) => {
      expect(fpath).toContain(TESTING_DIR_PATH);
    });
  });

  test('Check that hidden files are listed', () => {
    expect(listAllMdFilesResults).toContain(EXPECT_HIDDEN_MD_FILE_PATH);
  });

  test('Ensure all returned paths actually exist in the filesystem', () => {
    listAllMdFilesResults.forEach((fpath) => {
      expect(fs.existsSync(fpath)).toBeTruthy();
    });
  });
});

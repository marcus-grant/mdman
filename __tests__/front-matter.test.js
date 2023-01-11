const fs = require('fs');
const path = require('path');

const {
  matterStartDelimExists,
  matterEndDelimExists,
  matterExists,
  matterDelimMismatch,
  matterEmpty,
} = require('../lib/front-matter');

const {
  PROJECT_ROOT_PATH,
  TESTING_DIR_PATH,
} = require('../.jest/mocks');

const FILENAMES_WITH_MATTER = [
  '.hidden-markdown.md',
  'containers.md',
  'modify-this-file.md',
  'no-created-matter.md',
  'no-modified-matter.md',
  'os-shell.md',
];

const FILENAME_WITH_NO_MATTER = 'no-matter.md';
const FILENAME_WITH_EMPTY_MATTER = 'empty-matter.md';
const FILENAME_WITHOUT_START_MATTER_DELIM = 'no-starting-matter-delim.md';
const FILENAME_WITHOUT_END_MATTER_DELIM = 'no-closing-matter-delim.md';
const FILENAMES_WITHOUT_MATTER = [
  FILENAME_WITH_NO_MATTER,
  FILENAME_WITHOUT_START_MATTER_DELIM,
  FILENAME_WITHOUT_END_MATTER_DELIM,
];

let pathsWithMatter;
let pathsWithNoMatter;
let pathsWithEmptyMatter;
let pathWithoutStartMatterDelim;
let pathWithoutEndMatterDelim;
let pathsWithoutMatter;
beforeAll(() => {
  pathsWithMatter = (
    FILENAMES_WITH_MATTER.map((fname) => path.join(TESTING_DIR_PATH, fname)));
  pathsWithNoMatter = [path.join(TESTING_DIR_PATH, FILENAME_WITH_NO_MATTER)];
  pathsWithEmptyMatter = [path.join(TESTING_DIR_PATH, FILENAME_WITH_EMPTY_MATTER)];
  pathWithoutStartMatterDelim = (
    path.join(TESTING_DIR_PATH, FILENAME_WITHOUT_START_MATTER_DELIM));
  pathWithoutEndMatterDelim = (
    path.join(TESTING_DIR_PATH, FILENAME_WITHOUT_END_MATTER_DELIM));
  pathsWithoutMatter = (
    FILENAMES_WITHOUT_MATTER.map((fname) => path.join(TESTING_DIR_PATH, fname)));
});

describe('Test lib/front-matter.matterStartDelimExists()', () => {
  test('Truthy when file contents have 1st line `---`', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(matterStartDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
    expect(matterStartDelimExists(fs.readFileSync(pathWithoutEndMatterDelim)))
      .toBeTruthy();
    pathsWithMatter.forEach((fpath) => {
      expect(matterStartDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  test('Falsy when file contents does not have 1st line `---`', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(matterStartDelimExists(fs.readFileSync(fpath))).toBeFalsy();
    });
    expect(matterStartDelimExists(fs.readFileSync(pathWithoutStartMatterDelim)))
      .toBeFalsy();
  });
});

describe('Test lib/front-matter.matterEndDelimExists()', () => {
  test('Truthy when file contents have `---`, after 1st line', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(matterEndDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
    expect(matterEndDelimExists(fs.readFileSync(pathWithoutStartMatterDelim)))
      .toBeTruthy();
    pathsWithMatter.forEach((fpath) => {
      expect(matterEndDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  test('Falsy when file contents does not have `---`, after 1st line', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(matterEndDelimExists(fs.readFileSync(fpath))).toBeFalsy();
    });
    expect(matterEndDelimExists(fs.readFileSync(pathWithoutEndMatterDelim)))
      .toBeFalsy();
  });
});

describe('Test lib/front-matter.matterExists()', () => {
  test('Truthy when `---` frontmatter delimeter exists in 1st line & somewhere after', () => {
    pathsWithMatter.forEach(fpath => {
      expect(matterExists(fs.readFileSync(fpath))).toBeTruthy();
    });
    pathsWithEmptyMatter.forEach(fpath => {
      expect(matterExists(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  test('Falsy when `---` delimiter either doesn\'t exist at start or after in file', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(matterExists(fs.readFileSync(fpath))).toBeFalsy();
    });
    expect(matterExists(fs.readFileSync(pathWithoutEndMatterDelim)))
      .toBeFalsy();
    expect(matterExists(fs.readFileSync(pathWithoutStartMatterDelim)))
      .toBeFalsy();
  });
});

describe('Test lib/front-matter.matterDelimMismatch()', () => {
  test('Truthy when `---` frontmatter delimeter exists in 1st line, but not after', () => {
    expect(matterDelimMismatch(fs.readFileSync(pathWithoutEndMatterDelim))).toBeTruthy();
  });

  test('Truthy when `---` frontmatter delimeter does not exists in 1st line, but does after', () => {
    expect(matterDelimMismatch(fs.readFileSync(pathWithoutStartMatterDelim))).toBeTruthy();
  });

  test('Falsy when no frontmatter delimeters exist', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(matterDelimMismatch(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  test('Falsy when frontmatter empty', () => {
    pathsWithEmptyMatter.forEach(fpath => {
      expect(matterDelimMismatch(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  test('Falsy with existing & populated frontmatter', () => {
    pathsWithMatter.forEach(fpath => {
      expect(matterDelimMismatch(fs.readFileSync(fpath))).toBeFalsy();
    });
  });
});

describe('Test lib/front-matter.matterEmpty()', () => {
  test('Truthy when frontmatter exists but is empty', () => {
    pathsWithEmptyMatter.forEach(fpath => {
      expect(matterEmpty(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  test('Falsy when front matter exists & is populated', () => {
    pathsWithMatter.forEach(fpath => {
      expect(matterEmpty(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  test('Falsy when no properly formatted frontmatter exists', () => {
    pathsWithoutMatter.forEach(fpath => {
      expect(matterEmpty(fs.readFileSync(fpath))).toBeFalsy();
    });
  });
});
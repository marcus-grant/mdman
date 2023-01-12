const fs = require('fs');
const path = require('path');

const {
  startDelimExists,
  endDelimExists,
  exists,
  delimMismatch,
  empty,
  modifiedExists,
  modifiedDate,
} = require('../lib/front-matter');

const {
  // PROJECT_ROOT_PATH,
  TESTING_DIR_PATH,
} = require('../.jest/mocks');

const FILENAMES_WITH_MATTER = [
  'matter-modified.md',
  '.hidden-markdown.md',
  'containers.md',
  'modify-this-file.md',
  'no-created-matter.md',
  'no-modified-matter.md',
  'os-shell.md',
];

const FILENAMES_WITH_MODIFIED_MATTER = [
  'matter-modified.md',
  '.hidden-markdown.md',
  'modify-this-file.md',
];
const FILENAMES_WITH_INVALID_MODIFIED_MATTER = [
  'invalid-modified-date.md',
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
let pathsWithModifiedMatter;
let pathsWithInvalidModifiedMatter;
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
  pathsWithModifiedMatter = (
    FILENAMES_WITH_MODIFIED_MATTER.map((fname) => path.join(TESTING_DIR_PATH, fname)));
  pathsWithInvalidModifiedMatter = (
    FILENAMES_WITH_INVALID_MODIFIED_MATTER.map((fname) => path.join(TESTING_DIR_PATH, fname)));
});

describe('lib/front-matter.startDelimExists()', () => {
  it('Truthy when file contents have 1st line `---`', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(startDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
    expect(startDelimExists(fs.readFileSync(pathWithoutEndMatterDelim)))
      .toBeTruthy();
    pathsWithMatter.forEach((fpath) => {
      expect(startDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  it('Falsy when file contents does not have 1st line `---`', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(startDelimExists(fs.readFileSync(fpath))).toBeFalsy();
    });
    expect(startDelimExists(fs.readFileSync(pathWithoutStartMatterDelim)))
      .toBeFalsy();
  });
});

describe('lib/front-matter.endDelimExists()', () => {
  it('Truthy when file contents have `---`, after 1st line', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(endDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
    expect(endDelimExists(fs.readFileSync(pathWithoutStartMatterDelim)))
      .toBeTruthy();
    pathsWithMatter.forEach((fpath) => {
      expect(endDelimExists(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  it('Falsy when file contents does not have `---`, after 1st line', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(endDelimExists(fs.readFileSync(fpath))).toBeFalsy();
    });
    expect(endDelimExists(fs.readFileSync(pathWithoutEndMatterDelim)))
      .toBeFalsy();
  });
});

describe('lib/front-matter.exists()', () => {
  it('Truthy when `---` frontmatter delimeter exists in 1st line & somewhere after', () => {
    pathsWithMatter.forEach((fpath) => {
      expect(exists(fs.readFileSync(fpath))).toBeTruthy();
    });
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(exists(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  it('Falsy when `---` delimiter either doesn\'t exist at start or after in file', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(exists(fs.readFileSync(fpath))).toBeFalsy();
    });
    expect(exists(fs.readFileSync(pathWithoutEndMatterDelim)))
      .toBeFalsy();
    expect(exists(fs.readFileSync(pathWithoutStartMatterDelim)))
      .toBeFalsy();
  });
});

describe('lib/front-matter.delimMismatch()', () => {
  it('Truthy when `---` frontmatter delimeter exists in 1st line, but not after', () => {
    expect(delimMismatch(fs.readFileSync(pathWithoutEndMatterDelim))).toBeTruthy();
  });

  it('Truthy when `---` frontmatter delimeter does not exists in 1st line, but does after', () => {
    expect(delimMismatch(fs.readFileSync(pathWithoutStartMatterDelim))).toBeTruthy();
  });

  it('Falsy when no frontmatter delimeters exist', () => {
    pathsWithNoMatter.forEach((fpath) => {
      expect(delimMismatch(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  it('Falsy when frontmatter empty', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(delimMismatch(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  it('Falsy with existing & populated frontmatter', () => {
    pathsWithMatter.forEach((fpath) => {
      expect(delimMismatch(fs.readFileSync(fpath))).toBeFalsy();
    });
  });
});

describe('lib/front-matter.empty()', () => {
  it('Truthy when frontmatter exists but is empty', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(empty(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  it('Falsy when front matter exists & is populated', () => {
    pathsWithMatter.forEach((fpath) => {
      expect(empty(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  it('Falsy when no properly formatted frontmatter exists', () => {
    pathsWithoutMatter.forEach((fpath) => {
      expect(empty(fs.readFileSync(fpath))).toBeFalsy();
    });
  });
});

describe('lib/front-matter.modifiedExists()', () => {
  it('Truthy when frontmatter exists with "modified" field', () => {
    pathsWithModifiedMatter.forEach((fpath) => {
      expect(modifiedExists(fs.readFileSync(fpath))).toBeTruthy();
    });
  });

  it('Falsy when no frontmatter delimeters', () => {
    pathsWithoutMatter.forEach((fpath) => {
      expect(modifiedExists(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  it('Falsy when empty frontmatter', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(modifiedExists(fs.readFileSync(fpath))).toBeFalsy();
    });
  });

  it('Falsy when matter exists, but not the `modified` field', () => {
    pathsWithMatter.forEach((fpath) => {
      if (!pathsWithModifiedMatter.includes(fpath)) {
        expect(modifiedExists(fs.readFileSync(fpath))).toBeFalsy();
      }
    });
  });
});

describe('lib/front-matter.modifiedDate()', () => {
  let correctDates = [];
  beforeAll(() => {
    // Create array of correct answers in order with pathsWithModifiedMatter
    correctDates = [
      new Date(2023, 0, 1, 0, 59, 59),
      new Date(2022, 11, 31, 23, 59, 0),
      new Date(2000, 0, 1, 1, 1, 0),
    ];
  });
  it('Returns correct Date object with valid modified mattered files', () => {
    for (let i = 0; i < pathsWithModifiedMatter.length; i += 1) {
      const correctDate = correctDates[i];
      const fpath = pathsWithModifiedMatter[i];
      const fileBuf = fs.readFileSync(fpath);
      const modifiedDateResult = modifiedDate(fileBuf);
      expect(modifiedDateResult).toEqual(correctDate);
    }
  });

  it('Null when no frontmatter delimeters', () => {
    pathsWithoutMatter.forEach((fpath) => {
      expect(modifiedDate(fs.readFileSync(fpath))).toBeNull();
    });
  });

  it('Null when empty frontmatter', () => {
    pathsWithEmptyMatter.forEach((fpath) => {
      expect(modifiedDate(fs.readFileSync(fpath))).toBeNull();
    });
  });

  it('Null when matter exists, but not the `modified` field', () => {
    pathsWithMatter.forEach((fpath) => {
      if (!pathsWithModifiedMatter.includes(fpath)) {
        expect(modifiedDate(fs.readFileSync(fpath))).toBeNull();
      }
    });
  });

  it('Undefined when modified matter exists, but its value is invalid', () => {
    pathsWithInvalidModifiedMatter.forEach((fpath) => {
      expect(modifiedDate(fs.readFileSync(fpath))).toBeUndefined();
    });
  });
});

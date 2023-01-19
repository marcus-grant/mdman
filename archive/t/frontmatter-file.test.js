const fs = require('fs');
const path = require('path');
const FMFile = require('../lib/frontmatter-file');
const {
  TESTING_DIR_PATH,
} = require('../../.jest/mocks');

const testDirAbsPath = (fname) => path.join(TESTING_DIR_PATH, fname);

describe('lib/front-matterfile.Constructor', () => {
  let tagMatterFile;
  beforeAll(() => {
    // tagMatterFile = fs.readFileSync(testDirAbsPath('modified-matter.md'));
    tagMatterFile = testDirAbsPath('matter-tags.md');
  });
  it('test', () => {
    const fmf = FMFile(tagMatterFile);
    expect(fmf.stringify()).toEqual(`---
tags: [a, b, c, d, e, f, g]
---
# Markdown File with Tags

There's a list of tags in the YAML frontmatter.
Should affect how stringifying happens depending on \`flowLevel\`.
`);
  });
});

// describe('lib/frontmatter-file.getModifiedDate()', () => {
//   let modifiedMatterFile;
//   beforeAll(() => {
//     modifiedMatterFile = FMFile(testDirAbsPath('matter-modified.md'));
//   });
//   it('returns a date', () => {
//     expect(modifiedMatterFile.getModifiedDate()).toEqual(new Date());
//   });
// });

const fs = require('fs');
const matter = require('gray-matter');
// const path = require('path');

const {
  // TESTING_DIR_PATH,
  testDirAbsPath,
} = require('../../.jest/mocks');
const {
  stringifyFormatter,
  readFrontMatterFile,
} = require('../lib/fmfile');

describe('fmfile.readFrontMatterFile', () => {
  it('property.filePath is there & correct', () => {
    expect(readFrontMatterFile(testDirAbsPath('matter-tags.md')).filePath)
      .toEqual(testDirAbsPath('matter-tags.md'));
  });

  it('(from graymatter)property.data has matter-tags.md correct object', () => {
    expect(readFrontMatterFile(testDirAbsPath('matter-tags.md')).data)
      .toEqual({ tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
  });

  it('property.stringify() (from graymatter) stringifies matter-nested.md w/ defaults', () => {
    expect(readFrontMatterFile(testDirAbsPath('matter-nested.md')).stringify())
      .toBe(('---\n'
        + 'created: 2023-01-01T00:00:00.000Z\n'
        + 'tags: [new-years,party,2023]\n'
        + 'info: {"party":true, "place":THE_PLACE}\n'
        + '---\n'
        + '# It\'s 2023\n'
        + '\n'
        + 'Party at the place!\n'
      ));
  });
});

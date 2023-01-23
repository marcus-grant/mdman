const mock = require('mock-fs');
const fs = require('fs');
const graymatter = require('gray-matter');

const fmFixer = require('../lib/frontmatter-file-fixer');

describe(fmFixer.stringifyWithOptions, () => {
  let nestedLongYamlMatter;
  let matterFileStr;
  let stringifiedLines;
  beforeEach(() => {
    nestedLongYamlMatter = graymatter(''
      + '---\n'
      + 'shortList: [a,b,c]\n'
      + 'longList: [abcdefghijklmnopqrstuvwxyz0123456789, '
      + 'dog, cat, elephant, giraffe, lion, tiger, snake, pelican, chicken]'
      + 'object: { foo: bar, hello: world }\n'
      + '---\n'
      + 'Hello World!\n');
    matterFileStr = fmFixer.stringifyWithOptions(nestedLongYamlMatter);
    stringifiedLines = matterFileStr.split('\n');
  });
  afterEach(() => { mock.restore(); });
  it('default stringify has single & condensed line flow on collection YAML matter', () => {
    expect(stringifiedLines).toContain('shortList: [a,b,c]');
    expect(stringifiedLines).toContain((''
      + 'longList: [abcdefghijklmnopqrstuvwxyz0123456789,'
      + 'dog,cat,elephant,giraffe,lion,tiger,snake,pelican,chicken]'
    ));
  });
});

describe(fmFixer.addMatterMarkers, () => {
  it('returns object with fileStr\'s 1st two lines are "---"', () => {
    const result = fmFixer.addMatterMarkers({ fileStr: 'Hello world!\n' });
    expect(result.fileStr.split('\n')[0]).toEqual('---');
    expect(result.fileStr.split('\n')[1]).toEqual('---');
  });
});

describe('frontmatter-fixer date functions', () => {
  const epochDate = new Date(1000);
  const newerDate = new Date(2023, 0, 1, 0, 0, 0);
  const wrapMatter = (s = '') => `---\n${s || ''}---\nHello world!\n`;
  let matterNoMatter;
  let matterNoDate;
  let matterOldDates;
  beforeAll(() => {
    const epochStr = epochDate.toISOString();
    const epochDateMatter = `modified: ${epochStr}\ncreated: ${epochStr}\n`;
    mock({
      '/notes/epoch-time-no-matter.md': mock.file({
        mtime: epochDate,
        ctime: epochDate,
        birthtime: epochDate,
        content: 'Hello world!\n',
      }),
      '/notes/epoch-time-no-date-matter.md': mock.file({
        mtime: epochDate,
        ctime: epochDate,
        birthtime: epochDate,
        content: wrapMatter(),
      }),
      '/notes/newer-time-epoch-date-matter.md': mock.file({
        mtime: newerDate,
        ctime: newerDate,
        birthtime: newerDate,
        content:
          wrapMatter(epochDateMatter),
      }),
    });
    matterNoMatter = graymatter(fs.readFileSync('/notes/epoch-time-no-matter.md'));
    matterNoDate = graymatter(fs.readFileSync('/notes/epoch-time-no-date-matter.md'));
    matterOldDates = graymatter(fs.readFileSync('/notes/newer-time-epoch-date-matter.md'));
  });
  afterAll(() => { mock.restore(); });

  describe(fmFixer.updateModifiedMatter, () => {
    it('returns correct updated modified matter & string for files without matter', () => {
      const result = fmFixer.updateModifiedMatter({
        filePath: '/notes/epoch-time-no-matter.md',
        matter: matterNoMatter,
      });
      expect(result.matter.data.modified).toEqual(epochDate);
      expect(result.fileStr).toEqual(wrapMatter('modified: 1970-01-01T00:00:01.000Z\n'));
    });

    it('returns correct updated modified matter & string for files with empty matter', () => {
      const result = fmFixer.updateModifiedMatter({
        filePath: '/notes/epoch-time-no-date-matter.md',
        matter: matterNoDate,
      });
      expect(result.matter.data.modified).toEqual(epochDate);
      expect(result.fileStr).toEqual(wrapMatter('modified: 1970-01-01T00:00:01.000Z\n'));
    });

    it('returns correct updated modified matter & string for files with old dates matter', () => {
      const result = fmFixer.updateModifiedMatter({
        filePath: '/notes/newer-time-epoch-date-matter.md',
        matter: matterOldDates,
      });
      expect(result.matter.data.modified).toEqual(newerDate);
      expect(result.fileStr)
        .toEqual(wrapMatter('modified: 2023-01-01T00:00:00.000Z\ncreated: 1970-01-01T00:00:01.000Z\n'));
    });
  });

  describe(fmFixer.updateCreatedMatter, () => {
    it('returns correct updated created matter & string for files without matter', () => {
      const result = fmFixer.updateCreatedMatter({
        filePath: '/notes/epoch-time-no-matter.md',
        matter: matterNoMatter,
      });
      expect(result.matter.data.created).toEqual(epochDate);
      expect(result.fileStr).toEqual(wrapMatter('created: 1970-01-01T00:00:01.000Z\n'));
    });

    it('returns correct updated created matter & string for files with empty matter', () => {
      const result = fmFixer.updateCreatedMatter({
        filePath: '/notes/epoch-time-no-date-matter.md',
        matter: matterNoDate,
      });
      expect(result.matter.data.created).toEqual(epochDate);
      expect(result.fileStr).toEqual((''
        + '---\n'
        + 'created: 1970-01-01T00:00:01.000Z\n'
        + '---\n'
        + 'Hello world!\n'
      ));
    });

    it('returns correct updated created matter & string for files with old dates matter', () => {
      const result = fmFixer.updateCreatedMatter({
        matter: matterOldDates,
        filePath: '/notes/newer-time-epoch-date-matter.md',
      });
      expect(result.matter.data.created).toEqual(newerDate);
      expect(result.fileStr).toEqual((''
        + '---\n'
        + 'modified: 1970-01-01T00:00:01.000Z\n'
        + 'created: 2023-01-01T00:00:00.000Z\n'
        + '---\n'
        + 'Hello world!\n'
      ));
    });
  });
});

// eslint-disable-next-line no-unused-vars
const graymatter = require('gray-matter');
const mock = require('mock-fs');
// eslint-disable-next-line no-unused-vars
const fs = require('fs');

const handler = require('../lib/frontmatter-file-handler');

describe(handler.sortRules, () => {
  it('returns ALL rules in order of FMLXXX where XXX is an ascending #', () => {
    expect(handler.sortRules(handler.ALL_LINT_RULES))
      .toEqual(handler.ALL_LINT_RULES);
  });
  it('returns subsets of rules in order (FML{001,110,120}), when given out of order', () => {
    expect(handler.sortRules(['FML110', 'FML120', 'FML001']))
      .toEqual(['FML001', 'FML110', 'FML120']);
  });
  it('returns a single rule list when only one rule given', () => {
    expect(handler.sortRules(['FML111'])).toEqual(['FML111']);
  });
});

describe(handler.checkLintersOnFile, () => {
  let nowStr;
  let epochStr;
  beforeAll(() => {
    const now = new Date();
    const epoch = new Date(1000);
    nowStr = now.toISOString();
    epochStr = epoch.toISOString();
    mock({
      './a/no-matter': mock.file({
        content: 'Hello World!\n',
        mtime: now,
        ctime: epoch,
        birthtime: epoch,
      }),
      './a/foobar': '---\nfoo: bar\n---\nHello World!\n',
      './a/correct-dates': mock.file({
        content: `---\ncreated: ${nowStr}\nmodified: ${nowStr}\n---\nHello World!\n`,
        mtime: now,
        ctime: now,
        birthtime: now,
      }),
    });
  });
  afterAll(() => { mock.restore(); });

  it('returns all rules as failing on no front matter or their delimiters file', () => {
    // NOTE no FML003 since empty is valid
    expect(handler.checkLintersOnFile('./a/no-matter'))
      .toEqual(['FML001', 'FML002', 'FML100', 'FML101', 'FML110', 'FML111', 'FML120', 'FML121']);
  });

  it('returns failed rules on file according to subset of rules that fail', () => {
    // Note that of these three rules only FML100 & FML101 should fail
    // even though the other date based rules would fail
    expect(handler.checkLintersOnFile('./a/foobar', ['FML002', 'FML100', 'FML101']))
      .toEqual(['FML100', 'FML101']);
  });

  it('returns no rules on a correctly formatted file with dates', () => {
    expect(handler.checkLintersOnFile('./a/correct-dates')).toEqual([]);
  });

  // TODO: Move these into own section with mock restore for each written file
  it('fixes all rules of all files', () => {
    const failedRules = handler.checkLintersOnFile('./a/no-matter');
    handler.applyAllFixesToFile('./a/no-matter', failedRules);
    expect(fs.readFileSync('./a/no-matter').toString())
      .toEqual(`---\ncreated: ${epochStr}\nmodified: ${nowStr}\n---\nHello World!\n`);
  });
});
// describe(handler.checkLinterOnFile, () => {
//   beforeAll(() => {
//     const now = new Date();
//     const nowStr = now.toISOString();
//     const epochDate = new Date(1000);
//     const epochStr = epochDate.toISOString();
//     const wrapMatter = (matterStr) => `---\n${matterStr}---\n`;
//     const mdFileStr = (matterStr) => `${wrapMatter(matterStr)}Hello World!\n`;
//     const mockFile = (matterStr, mtime = now, birthtime = now) => mock.file({
//       content: mdFileStr(matterStr),
//       ctime: birthtime,
//       mtime,
//       birthtime,
//     });
//     mock({
//       '/foo/fml001-pass': '---\n---\nHello World!\n',
//       '/foo/fml001-fail': 'Hello World!\n',
//       '/foo/fml002-pass': mockFile('foo: bar\n'),
//       '/foo/fml002-fail': '---\n---\nHello World!\n',
//       '/foo/fml003-pass': mdFileStr('foo: bar\nhello: world\n'),
//       '/foo/fml003-fail': mdFileStr('foo: bar\nfoo: baz\n'),
//       '/foo/fml100-pass': mdFileStr(`created: ${nowStr}\nmodified: ${nowStr}`),
//       '/foo/fml100-fail': mdFileStr('foo: bar'),
//       '/foo/fml101-pass': mdFileStr(`created: ${nowStr}\nmodified: ${nowStr}`),
//       '/foo/fml101-fail': mdFileStr('foo: bar'),
//       '/foo/fml110-pass': mdFileStr(`created: ${nowStr}\nmodified: ${nowStr}`),
//       '/foo/fml110-fail': mdFileStr('foo: bar'),
//       '/foo/fml111-pass': mdFileStr(`created: ${nowStr}\nmodified: ${nowStr}`),
//       '/foo/fml111-fail': mdFileStr('foo: bar'),
//       '/foo/fml120-pass': mockFile(`created: ${epochStr}\nmodified: ${nowStr}`, now, now),
//       '/foo/fml120-fail': mockFile(`created: ${nowStr}\nmodified: ${nowStr}`, now, epochDate),
//       '/foo/fml121-pass': mockFile(`created: ${epochStr}\nmodified: ${nowStr}`, now, now),
//       '/foo/fml121-fail': mockFile(`created: ${epochStr}\nmodified: ${epochStr}`, now, now),
//     });
//   });
//   afterAll(() => { mock.restore(); });

//   it('applies fml(001,002,003,100,101,110,111,120,121) rules correctly FML000pass', () => {
//     const filePaths = fs.readdirSync('foo');
//     filePaths.forEach((filePath) => {
//       expect(handler.checkLinterOnFile(filePath, handler.ALL_LINT_RULES)
//         .toEqual(filePath.includes('fail') ? false : true)
//     });
//   });
// });

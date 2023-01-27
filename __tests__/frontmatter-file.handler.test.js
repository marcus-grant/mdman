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

describe('frontmatter-file-handler handlers using files', () => {
  const now = new Date();
  const epoch = new Date(1000);
  let nowStr;
  let epochStr;
  let filePaths;
  let lintResults;
  beforeAll(() => {
    nowStr = now.toISOString();
    epochStr = epoch.toISOString();
    mock(
      {
        './a/not-markdown.txt': 'FUBAR\n',
        './a/no-matter.md': mock.file({
          content: 'Hello World!\n',
          mtime: now,
          ctime: epoch,
          birthtime: epoch,
        }),
        './a/foobar.md': '---\nfoo: bar\n---\nHello World!\n',
        './a/correct-dates.md': mock.file({
          content: `---\ncreated: ${nowStr}\nmodified: ${nowStr}\n---\nHello World!\n`,
          mtime: now,
          ctime: now,
          birthtime: now,
        }),
        './b/no-matter.md': mock.file({
          content: 'Hello World!\n',
          mtime: now,
          ctime: epoch,
          birthtime: epoch,
        }),
        './c/no-matter.md': mock.file({
          content: 'Hello World!\n',
          mtime: now,
          ctime: epoch,
          birthtime: epoch,
        }),
        './c/foobar.md': mock.file({
          content: '---\nfoo: bar\n---\nHello World!\n',
          mtime: now,
          ctime: now,
          birthtime: now,
        }),
        './c/correct-dates.md': mock.file({
          content: `---\ncreated: ${nowStr}\nmodified: ${nowStr}\n---\nHello World!\n`,
          mtime: now,
          ctime: epoch,
          birthtime: epoch,
        }),
      },
    );
    filePaths = fs.readdirSync('./a').map((fp) => `./a/${fp}`);
    lintResults = handler.checkLintersOnFiles(filePaths);
  }); afterAll(() => { mock.restore(); });

  describe(handler.checkLintersOnFile, () => {
    it('returns all rules as failing on no front matter or their delimiters file', () => {
      // NOTE no FML003 since empty is valid
      expect(handler.checkLintersOnFile('./a/no-matter.md'))
        .toEqual(['FML001', 'FML002', 'FML100', 'FML101', 'FML110', 'FML111', 'FML120', 'FML121']);
    });

    it('returns failed rules on file according to subset of rules that fail', () => {
      // Note that of these three rules only FML100 & FML101 should fail
      // even though the other date based rules would fail
      expect(handler.checkLintersOnFile('./a/foobar.md', ['FML002', 'FML100', 'FML101']))
        .toEqual(['FML100', 'FML101']);
    });

    it('returns no rules on a correctly formatted file with dates', () => {
      expect(handler.checkLintersOnFile('./a/correct-dates.md')).toEqual([]);
    });
  });

  describe(handler.checkLintersOnFiles, () => {
    it('contains array with all rules as failing on no front matter or their delimiters file', () => {
      expect(lintResults.find((e) => e.filePath === './a/no-matter.md').rules)
        .toEqual(['FML001', 'FML002', 'FML100', 'FML101', 'FML110', 'FML111', 'FML120', 'FML121']);
    });
    it('contains array with subset of rules as failing on no date matter file', () => {
      expect(lintResults.find((e) => e.filePath === './a/foobar.md').rules)
        .toEqual(['FML100', 'FML101', 'FML110', 'FML111', 'FML120', 'FML121']);
    });
    it('contains array with failed rules as failing on correctly formatted file', () => {
      expect(lintResults.find((e) => e.filePath === './a/correct-dates.md'))
        .toBeFalsy();
    });
  });

  describe(handler.checkLintersOnDir, () => {
    let dirLintResults;
    beforeAll(() => {
      dirLintResults = handler.checkLintersOnDir('./a');
    });

    it('result list has file failing all rules except FML000 when no matter markers', () => {
      expect(dirLintResults.find((e) => e.filePath === './a/no-matter.md').rules)
        .toEqual(['FML001', 'FML002', 'FML100', 'FML101', 'FML110', 'FML111', 'FML120', 'FML121']);
    });

    it('result list has no filePath to non markdown files, like ./a/not-markdown.txt', () => {
      expect(dirLintResults.find((e) => e.filePath === './a/not-markdown.txt'))
        .toBeFalsy();
      expect(fs.readdirSync('./a')).toContain('not-markdown.txt');
    });
  });

  describe(handler.applyFixToFile, () => {
    it('fix result with no matter markers by adding them when FML001 is the rule', () => {
      const filePath = './a/no-matter.md';
      const result = handler.applyFixToFile(filePath, 'FML001');
      // const fixed = fs.readFileSync(filePath).toString('utf-8');
      expect(result.fileStr).toEqual('---\n---\nHello World!\n');
    });

    it('fix result correct with FML100 or no created date matter', () => {
      const filePath = './a/foobar.md';
      const result = handler.applyFixToFile(filePath, 'FML100');
      const resultStrLines = result.fileStr.split('\n');
      // const fixed = fs.readFileSync(filePath).toString('utf-8');
      expect(resultStrLines[0]).toEqual('---');
      expect(resultStrLines[1]).toEqual('foo: bar');
      expect(resultStrLines[2]).toContain(`created: ${now.getUTCFullYear()}`);
      expect(resultStrLines[2]).toContain('Z');
      expect(resultStrLines[3]).toEqual('---');
      expect(resultStrLines[4]).toEqual('Hello World!');
    });

    it('fix result undefined when given a rule with LINT.level === error (FML000)', () => {
      const filePath = './a/no-matter.md';
      const result = handler.applyFixToFile(filePath, 'FML000');
      // const fixed = fs.readFileSync(filePath).toString('utf-8');
      expect(result).toBeUndefined();
    });

    it('fix result null when given a rule with no fixer (FML002)', () => {
      const filePath = './a/no-matter.md';
      const result = handler.applyFixToFile(filePath, 'FML002');
      // const fixed = fs.readFileSync(filePath).toString('utf-8');
      expect(result).toBeNull();
    });
  });

  describe(handler.applyAllFixesToFile, () => {
    beforeAll(() => {
      handler.applyAllFixesToFile('./b/no-matter.md', handler.ALL_LINT_RULES);
    });

    // TODO: Add test for checking that fixer functions have been called exactly once
    it('saves correct file contents without error when given all lint-fix pairs', () => {
      const filePath = './b/no-matter.md';
      handler.applyAllFixesToFile(filePath, handler.ALL_LINT_RULES);
      const resultLines = fs.readFileSync(filePath).toString('utf-8').split('\n');
      expect(resultLines[0] === resultLines[3] && resultLines[0] === '---')
        .toBeTruthy();
      expect(resultLines[1]).toEqual(`created: ${epochStr}`);
      expect(resultLines[2]).toContain(`modified: ${now.getUTCFullYear()}`);
      expect(resultLines[2]).toContain('Z');
      expect(resultLines[4]).toEqual('Hello World!');
    });
  });

  describe(handler.applyAllFixesToFiles, () => {
    const fileStrsByFilePaths = {};
    beforeAll(() => {
      const fPaths = fs.readdirSync('./c').map((f) => `./c/${f}`);
      const linterResults = handler.checkLintersOnFiles(fPaths);
      handler.applyAllFixesToFiles(linterResults);
      fPaths.forEach((fp) => {
        fileStrsByFilePaths[fp] = fs.readFileSync(fp).toString('utf-8');
      });
    });

    it('correctly fixes all problems in a file without matter markers (ie all fixes)', () => {
      expect(fileStrsByFilePaths['./c/no-matter.md'])
        .toEqual((''
          + '---\n'
          + `created: ${epochStr}\n`
          + `modified: ${nowStr}\n`
          + '---\n'
          + 'Hello World!\n'
        ));
    });

    it('correctly fixes a subset of problems, namely missing dates on files missing them', () => {
      expect(fileStrsByFilePaths['./c/foobar.md'])
        .toEqual((''
          + '---\n'
          + 'foo: bar\n'
          + `created: ${nowStr}\n`
          + `modified: ${nowStr}\n`
          + '---\n'
          + 'Hello World!\n'
        ));
    });
  });
});

// TODO: Move these into own section with mock restore for each written file
// it('fixes all rules of all files', () => {
//   const failedRules = handler.checkLintersOnFile('./a/no-matter');
//   handler.applyAllFixesToFile('./a/no-matter', failedRules);
//   expect(fs.readFileSync('./a/no-matter').toString())
//     .toEqual(`---\ncreated: ${epochStr}\nmodified: ${nowStr}\n---\nHello World!\n`);
// });

const mock = require('mock-fs');
const fs = require('fs');
const graymatter = require('gray-matter');

const fmlint = require('../lib/frontmatter-file-linter');

describe(fmlint.hasMatterMarker, () => {
  it('falsy when file has no matter markers at all', () => {
    expect(fmlint.hasMatterMarker({
      fileStr: (''
      + '# Title\n'
      + 'Body text.\n'
      ),
    })).toBeFalsy();
  });

  it('falsy when file has only ending matter marker', () => {
    expect(fmlint.hasMatterMarker({
      fileStr: (''
      + 'modified: 2023-01-01T00:00:00Z\n'
      + '---\n'
      + '# Title\n'
      + 'Body text.\n'
      ),
    })).toBeFalsy();
  });

  it('is falsy when file has only starting matter marker', () => {
    expect(fmlint.hasMatterMarker({
      fileStr: (''
      + '---\n'
      + 'modified: 2023-01-01T00:00:00Z\n'
      + '# Title\n'
      + 'Body text.\n'
      ),
    })).toBeFalsy();
  });

  it('is truthy when file has empty matter', () => {
    expect(fmlint.hasMatterMarker({
      fileStr: (''
      + '---\n'
      + '---\n'
      + '# Title\n'
      + 'Body text.\n'
      ),
    })).toBeTruthy();
  });

  it('is truthy when file has empty matter', () => {
    expect(fmlint.hasMatterMarker({
      fileStr: (''
      + '---\n'
      + 'modified: 2023-01-01T00:00:00Z\n'
      + '---\n'
      + '# Title\n'
      + 'Body text.\n'
      ),
    })).toBeTruthy();
  });
});

describe(fmlint.nonEmptyMatter, () => {
  it('is truthy when theres a frontmatter field', () => {
    const fileStr = (''
      + '---\n'
      + 'modified: 2022-01-01T00:00:00Z\n'
      + '---\n'
      + '# Title\n'
      + 'Body text.\n'
    );
    expect(fmlint.nonEmptyMatter({
      matter: graymatter(fileStr),
      fileStr,
    })).toBeTruthy();
  });

  it('is falsy when theres no frontmatter fields', () => {
    const fileStr = (''
      + '---\n'
      + '---\n'
      + '# Title\n'
      + 'Body text.\n'
    );
    expect(fmlint.nonEmptyMatter({
      matter: graymatter(fileStr),
      fileStr,
    })).toBeFalsy();
  });

  it('is undefined when theres no frontmatter markers', () => {
    const fileStr = (''
      + '# Title\n'
      + 'Body text.\n'
    );
    expect(fmlint.nonEmptyMatter({
      matter: graymatter(fileStr),
      fileStr,
    })).toBeUndefined();
  });
});

describe(fmlint.hasValidYaml, () => {
  let duplicateMatterStr;
  let validMatterStr;
  beforeAll(() => {
    duplicateMatterStr = (''
      + '---\n'
      + 'foo: bar\n'
      + 'foo: bas\n'
      + '---\n'
      + 'foobar.\n'
    );
    validMatterStr = (''
      + '---\n'
      + 'foo: bar\n'
      + '---\n'
      + 'foobar.\n'
    );
  });

  it('is falsy when there are duplicate fields in YAML frontmatter', () => {
    expect(fmlint.hasValidYaml({ fileStr: duplicateMatterStr }))
      .toBeFalsy();
  });

  it('is truthy when YAML frontmatter is valid', () => {
    expect(fmlint.hasValidYaml({ fileStr: validMatterStr }))
      .toBeTruthy();
  });
});

describe('frontmatter-file-linter Date based functions', () => {
  let oldMTime;
  let newMTime;
  beforeAll(() => {
    oldMTime = new Date(1);
    newMTime = new Date();
    const mdContent = '# Title\n' + 'Body text.\n';
    mock({
      '/notes/no-modified-created-matter.md': mock.file(
        {
          content: (''
            + '---\n'
            + `---\n${mdContent}`
          ),
          birthtime: oldMTime,
          ctime: oldMTime,
          mtime: oldMTime,
        },
      ),
      '/notes/invalid-modified-created-matter.md': mock.file(
        {
          content: (''
            + '---\n'
            + 'modified: foobar\n'
            + 'created: foobar\n'
            + `---\n${mdContent}`
          ),
          birthtime: oldMTime,
          ctime: oldMTime,
          mtime: oldMTime,
        },
      ),
      '/notes/newly-modified-created-matter.md': mock.file(
        {
          content: (''
            + '---\n'
            + 'modified: 2023-01-01T00:00:00Z\n'
            + 'created: 2023-01-01T00:00:00Z\n'
            + `---\n${mdContent}`
          ),
          birthtime: oldMTime,
          ctime: oldMTime,
          mtime: oldMTime,
        },
      ),
      '/notes/old-modified-created-matter.md': mock.file(
        {
          content: (''
            + '---\n'
            + 'modified: 2000-01-01T00:00:00Z\n'
            + 'created: 2000-01-01T00:00:00Z\n'
            + `---\n${mdContent}`
          ),
          birthtime: newMTime,
          ctime: newMTime,
          mtime: newMTime,
        },
      ),
      '/notes/matching-modified-created-matter.md': mock.file(
        {
          content: (''
            + '---\n'
            + `modified: ${newMTime.toISOString()}\n`
            + `created: ${newMTime.toISOString()}\n`
            + `---\n${mdContent}`
          ),
          birthtime: newMTime,
          ctime: newMTime,
          mtime: newMTime,
        },
      ),
    });
  });
  afterAll(() => { mock.restore(); });

  describe(fmlint.hasModifiedMatter, () => {
    it('is truthy when theres modified matter field ', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/newly-modified-created-matter.md'),
      );
      expect(fmlint.hasModifiedMatter({ matter })).toBeTruthy();
    });

    it('is falsy when theres no modified matter field', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/no-modified-created-matter.md'),
      );
      expect(fmlint.hasModifiedMatter({ matter })).toBeFalsy();
    });
  });

  describe(fmlint.hasValidModifiedMatterDate, () => {
    it('is truthy when theres modified matter field with Date object', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/newly-modified-created-matter.md'),
      );
      expect(fmlint.hasValidModifiedMatterDate({ matter })).toBeTruthy();
    });

    it('is falsy when theres modified matter field with no Date object', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/invalid-modified-created-matter.md'),
      );
      expect(fmlint.hasValidModifiedMatterDate({ matter })).toBeFalsy();
    });
  });

  describe(fmlint.modifiedMatterNewerThanMTime, () => {
    it('is truthy when modified matter date is newer than fs.stat.mtime', () => {
      const filePath = '/notes/newly-modified-created-matter.md';
      const matter = graymatter(fs.readFileSync(filePath));
      expect(fmlint.modifiedMatterNewerThanMTime({ matter, filePath }))
        .toBeTruthy();
    });

    it('is falsy when modified matter date is older than fs.stat.mtime', () => {
      const filePath = '/notes/old-modified-created-matter.md';
      expect(fmlint.modifiedMatterNewerThanMTime({
        matter: graymatter(fs.readFileSync(filePath)),
        filePath,
      })).toBeFalsy();
    });

    it('is truthy when modified matter date is same as fs.stat.mtime', () => {
      const filePath = '/notes/matching-modified-created-matter.md';
      expect(fmlint.modifiedMatterNewerThanMTime({
        matter: graymatter(fs.readFileSync(filePath)),
        filePath,
      })).toBeTruthy();
    });
  });

  describe(fmlint.hasCreatedMatter, () => {
    it('is truthy when theres created matter field in file string', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/newly-modified-created-matter.md'),
      );
      expect(fmlint.hasCreatedMatter({ matter })).toBeTruthy();
    });

    it('is falsy when theres no created matter field in file string', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/no-modified-created-matter.md'),
      );
      expect(fmlint.hasCreatedMatter({ matter })).toBeFalsy();
    });
  });

  describe(fmlint.hasValidCreatedMatterDate, () => {
    it('is truthy when theres created matter field with Date object', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/newly-modified-created-matter.md'),
      );
      expect(fmlint.hasValidCreatedMatterDate({ matter })).toBeTruthy();
    });

    it('is falsy when theres created matter field with no Date object', () => {
      const matter = graymatter(
        fs.readFileSync('/notes/invalid-modified-created-matter.md'),
      );
      expect(fmlint.hasValidCreatedMatterDate({ matter })).toBeFalsy();
    });
  });

  describe(fmlint.createdMatterNewerThanBirthtime, () => {
    it('is truthy when created matter date is newer than fs.stat.mtime', () => {
      const filePath = '/notes/newly-modified-created-matter.md';
      const matter = graymatter(fs.readFileSync(filePath));
      expect(fmlint.createdMatterNewerThanBirthtime({
        filePath,
        matter,
      })).toBeTruthy();
    });

    it('is falsy when created matter date is older than fs.stat.mtime', () => {
      const filePath = '/notes/old-modified-created-matter.md';
      const matter = graymatter(fs.readFileSync(filePath));
      expect(fmlint.createdMatterNewerThanBirthtime({
        matter,
        filePath,
      })).toBeFalsy();
    });

    it('is truthy when created matter date is same as fs.stat.mtime', () => {
      const filePath = '/notes/matching-modified-created-matter.md';
      const matter = graymatter(fs.readFileSync(filePath));
      expect(fmlint.createdMatterNewerThanBirthtime({
        matter,
        filePath,
      })).toBeTruthy();
    });
  });
});

const fs = require('fs');
const graymatter = require('gray-matter');
const linters = require('./frontmatter-file-linter');
const fixers = require('./frontmatter-file-fixer');

const LINTER_MAP = {
  FML001: { name: 'has-matter-markers', level: 'warning',
    lint: linters.hasMatterMarker, fix: fixers.addMatterMarkers,
    desc: 'No frontmatter markers/delimiters found, necessary for frontmatter'
  },
  FML002: { name: 'non-empty-matter', level: 'warning',
    lint: linters.nonEmptyMatter, fix: null,
    desc: 'No frontmatter fields found, '
      + 'frontmatter is irrelevant without a field'
  },
  FML003: { name: 'has-valid-YAML', level: 'error',
    lint: linters.hasValidYaml, fix: null,
    desc: 'YAML frontmatter has formatting errors, '
      + 'needs to be fixed to continue',
  },
  FML100: { name: 'has-created-matter', level: 'info',
    lint: linters.hasCreatedMatter, fix: fixers.updateCreatedMatter,
    desc: "There is no 'created'/'birthtime' datetimestamp, "
      + "can't track its creation",
  },
  FML101: { name: 'has-modified-matter', level: 'info',
    lint: linters.hasModifiedMatter, fix: fixers.updateModifiedMatter,
    desc: "There is 'updated/modified/mtime datetimestamp, "
      + "can't track changes of file",
  },
  FML110: { name: 'has-valid-created-matter-date', level: 'info',
    lint: linters.hasValidCreatedMatterDate, fix: fixers.updateCreatedMatter,
    desc: "The 'created' matter field doesn't have a valid Date value, "
      + "can't track time",
  },
  FML111: { name: 'has-valid-modified-matter-date', level: 'info',
    lint: linters.hasValidModifiedMatterDate, fix: fixers.updateModifiedMatter,
    desc: "The 'modified' matter field doesn't have a valid Date value, "
      + "can't track time",
  },
  //TODO: We might want to have this track the oldest value between matter/stat
  FML120: { name: 'created-matter-older-than-birthtime', level: 'info',
    lint: linters.createdMatterNewerThanBirthtime, fix: fixers.updateCreatedMatter,
    desc: "The 'created' matter is newer than stat.birthtime, "
      + "the oldest date should be in matter to track correct birthtime",
  },
};

const LINT_TO_FIX_MAP = [
  { linter: linters.modifiedMatterNewerThanMTime, fixer: fixers.updateModifiedMatter },
  { linter: linters.createdMatterNewerThanBirthtime, fixer: fixers.updateCreatedMatter },
];

const ALL_LINTERS = [
  linters.hasMatterMarker,
  linters.nonEmptyMatter,
  linters.hasValidYaml,
  linters.hasModifiedMatter,
  linters.hasCreatedMatter,
  linters.hasValidModifiedMatterDate,
  linters.hasValidCreatedMatterDate,
  linters.modifiedMatterNewerThanMTime,
  linters.createdMatterNewerThanBirthtime,
];

const lintAllMdFiles = (dirPath, rules = ALL_LINTERS) => {
  const filePaths = fs.readdirSync(dirPath);
  const lintResults = filePaths.reduce(
    (lintResults, filePath) => {
      const matter = graymatter(fs.readFileSync(filePath));
      // TODO: (Refactor) Consider moving the stringify func somewhere better
      const fileStr = fixers.stringifyWithOptions(matter);
      let 
    },
    [],
  );
};

module.exports = {
  LINT_TO_FIX_MAP,
  ALL_LINTERS,
  lintAllMdFiles,
};

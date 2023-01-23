const fs = require('fs');
const graymatter = require('gray-matter');
const linters = require('./frontmatter-file-linter');
const fixers = require('./frontmatter-file-fixer');

/**
 * @typedef {Object} LintRule
 * @property {string} name the kebab case name of the linting rule (true for desired outcome)
 * @property {string} level the error level: error,warning,info
 * @property {CallableFunction} lint linter function that resolves to true to pass check
 * @property {?CallableFunction} fix fixer function that returns a ...
 * @property {string} errMsg description of the error
 */
/**
 * @typedef {Object} LintMap
 * @property {LintRule} rule the rule identifier FMLXXX
 */
const LINTER_MAP = {
  FML001: {
    name: 'has-matter-markers',
    level: 'warning',
    lint: linters.hasMatterMarker,
    fix: fixers.addMatterMarkers,
    errMsg: 'No frontmatter markers/delimiters found, necessary for frontmatter',
  },
  FML002: {
    name: 'non-empty-matter',
    level: 'warning',
    lint: linters.nonEmptyMatter,
    fix: null,
    errMsg: 'No frontmatter fields found, '
      + 'frontmatter is irrelevant without a field',
  },
  FML003: {
    name: 'has-valid-YAML',
    level: 'error',
    lint: linters.hasValidYaml,
    fix: null,
    errMsg: 'YAML frontmatter has formatting errors, '
      + 'needs to be fixed to continue',
  },
  FML100: {
    name: 'has-created-matter',
    level: 'info',
    lint: linters.hasCreatedMatter,
    fix: fixers.updateCreatedMatter,
    errMsg: "There is no 'created'/'birthtime' datetimestamp, "
      + "can't track its creation",
  },
  FML101: {
    name: 'has-modified-matter',
    level: 'info',
    lint: linters.hasModifiedMatter,
    fix: fixers.updateModifiedMatter,
    errMsg: "There is 'updated/modified/mtime datetimestamp, "
      + "can't track changes of file",
  },
  FML110: {
    name: 'has-valid-created-matter-date',
    level: 'info',
    lint: linters.hasValidCreatedMatterDate,
    fix: fixers.updateCreatedMatter,
    errMsg: "The 'created' matter field doesn't have a valid Date value, "
      + "can't track time",
  },
  FML111: {
    name: 'has-valid-modified-matter-date',
    level: 'info',
    lint: linters.hasValidModifiedMatterDate,
    fix: fixers.updateModifiedMatter,
    errMsg: "The 'modified' matter field doesn't have a valid Date value, "
      + "can't track time",
  },
  FML120: {
    name: 'created-matter-older-than-birthtime',
    level: 'info',
    lint: linters.createdMatterOlderThanBirthtime,
    fix: fixers.updateCreatedMatter,
    errMsg: "The 'created' matter is newer than stat.birthtime, "
      + 'the oldest date should be in matter to track correct birthtime',
  },
  FML121: {
    name: 'modified-matter-newer-than-mtime',
    level: 'info',
    lint: linters.modifiedMatterNewerThanMTime,
    fix: fixers.updateCreatedMatter,
    errMsg: "The 'modified' matter is older than stat.birthtime, "
      + 'the newest date should be in matter to track modifications to file',
  },
};

const ALL_LINT_RULES = Object.keys(LINTER_MAP);

const sortRules = (rules) => {
  const rulesSet = new Set(rules);
  const orderedRules = ALL_LINT_RULES.filter((rule) => rulesSet.has(rule));
  return orderedRules;
};

const checkLintRuleOnFile = (rule, filePath, fileStr, matter) => (
  LINTER_MAP[rule].lint({ filePath, fileStr, matter }));

const checkLintersOnFile = (filePath, rules = ALL_LINT_RULES) => {
  const orderedRules = sortRules(rules);
  const fileStr = fs.readFileSync(filePath).toString('utf-8');
  const matter = graymatter(fileStr);
  const failedRules = orderedRules
    .map((rule) => (checkLintRuleOnFile(rule, filePath, fileStr, matter) ? false : rule))
    .filter((x) => !!x);
  return failedRules;
};

const checkLintersOnFiles = (filePaths, rules = ALL_LINT_RULES) => (
  filePaths.map((filePath) => checkLintersOnFile(filePath, rules)));

const applyFixToFile = (filePath, rule, stringifyOptions = {}) => {
  const fileStr = fs.readFileSync(filePath).toString('utf-8');
  const matter = graymatter(fileStr);
  const fixedMatter = LINTER_MAP[rule].fix({ filePath, fileStr, matter }).matter;
  const { content, data } = fixedMatter;
  fs.writeFileSync(fixers.stringifyWithOptions({ content, data, stringifyOptions }));
};

const applyAllFixesToFile = (filePath, failedRules, stringifyOptions = {}) => {
  let fileStr = fs.readFileSync(filePath).toString('utf-8');
  let matter = graymatter(fileStr);
  const fixersUsed = new Set();
  failedRules.forEach((rule) => {
    const { fix } = LINTER_MAP[rule];
    if (fix !== null) {
      if (!fixersUsed.has(fix)) {
        const fixResult = fix({ filePath, fileStr, matter });
        matter = fixResult.matter;
        fileStr = fixResult.fileStr;
        fixersUsed.add(fix);
      }
    }
  });
  const { content, data } = matter;
  const newFileStr = fixers.stringifyWithOptions(content, data, stringifyOptions);
  fs.writeFileSync(filePath, newFileStr);
};

const applyAllFixesToFiles = (filePaths, failedRules, stringifyOptions = {}) => {
  filePaths.forEach((filePath) => {
    applyAllFixesToFile(filePath, failedRules, stringifyOptions);
  });
};

module.exports = {
  LINTER_MAP,
  ALL_LINT_RULES,
  sortRules,
  checkLintersOnFile,
  checkLintersOnFiles,
  applyAllFixesToFile,
  applyAllFixesToFiles,
};

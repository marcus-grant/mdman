const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const graymatter = require('gray-matter');

/**
 * @typedef {Object} FrontMatterLintProps
 * @property {?graymatter.GrayMatterFile} matter graymatter's file object
 * @property {?string} fileStr The stringifies contents of a frontmatter file
 * @property {?string} filePath The path to the file having linting checks run on it
 */
/**
 * Determines if string of file contents has both frontmatter markers ('---')
 * @param {FrontMatterLintProps} p FrontMatterLintProps object
 * @param {String} fileStr A string of a file's contents
 * @returns {boolean}
 */
const hasMatterMarker = ({ fileStr }) => {
  const lines = fileStr.split('\n');
  if (!lines[0].includes('---')) return false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.includes('---') && index !== 0) return true;
  } return false;
};

/**
 * Determines if file has frontmatter markers but is empty
 * @param {FrontMatterLintProps} p
 * @param {graymatter.GrayMatterFile} matter GrayMatterFile processed file object
 * @returns {boolean}
 */
const nonEmptyMatter = ({ matter, fileStr }) => (
  hasMatterMarker({ fileStr }) ? Object.keys(matter.data).length > 0 : false);

/**
 * Detects if a fileStr with frontmatter has valid formatting of YAML
 * @param {FrontMatterLintProps} p frontmatter linter props
 * @param {string} p.fileStr
 * @returns {boolean}
 */
const hasValidYaml = ({ fileStr }) => {
  try { graymatter(fileStr); } catch (e) {
    if (e.name === 'YAMLException') {
      return false;
    }
  }
  return true;
};

/**
 * Determines if the frontmatter has a 'modified' field
 * @param {FrontMatterLintProps} p frontmatter linter props
 * @param {?graymatter.GrayMatterFile} p.matter graymatter file object
 * @returns {boolean}
 */
const hasModifiedMatter = ({ matter }) => !!(matter.data.modified);

/**
 * Determines if the frontmatter has a valid Date object in 'modified' field
 * @param {FrontMatterLintProps} p frontmatter linter props
 * @param {?graymatter.GrayMatterFile} p.matter graymatter file object
 * @returns {boolean}
 */
const hasValidModifiedMatterDate = ({ matter }) => matter.data.modified instanceof Date;

/**
 * Determines if the date in the modified matter is newer than the 'mtime' using fs.stat
 * @param {FrontMatterLintProps} p frontmatter linter props
 * @param {?graymatter.GrayMatterFile} p.matter graymatter file object
 * @param {?string} p.filePath path to file
 * @returns {boolean}
 */
const modifiedMatterNewerThanMTime = ({ matter, filePath }) => {
  let result;
  try {
    result = matter.data.modified.getTime() >= fs.statSync(filePath).mtimeMs;
  } catch {
    return undefined;
  } return result;
};

/**
 * Determines if the frontmatter has a 'created' field
 * @param {FrontMatterLintProps} p frontmatter linter props
 * @param {?graymatter.GrayMatterFile} p.matter graymatter file object
 * @returns {boolean}
 */
const hasCreatedMatter = ({ matter }) => !!(matter.data.modified);

/**
 * Determines if the frontmatter has a valid Date object in 'created' field
 * @param {FrontMatterLintProps} p frontmatter linter props
 * @param {?graymatter.GrayMatterFile} p.matter graymatter file object
 * @returns {boolean}
 */
const hasValidCreatedMatterDate = ({ matter }) => matter.data.created instanceof Date;

/**
 * Determines if the date in the created matter is newer than the 'mtime' using fs.stat
 * @param {FrontMatterLintProps} p frontmatter linter props
 * @param {?graymatter.GrayMatterFile} p.matter graymatter file object
 * @param {?string} p.filePath path to file
 * @returns {boolean}
 */
const createdMatterOlderThanBirthtime = ({ matter, filePath }) => {
  let result;
  try {
    result = matter.data.created.getTime() <= fs.statSync(filePath).birthtimeMs;
  } catch {
    return undefined;
  } return result;
};

/**
 * @typedef {Object} FrontMatterLintResult
 * @property {String} filePath the path to the file with frontmatter (absolute)
 * @property {?String} lintRule the lint rule being broken
 */
// const lintDir = (dirPath, rules) => {
//   const files = fs.readdirSync(dirPath);
//   let lintResults;
//   files.forEach((file) => {
//     const matter = graymatter.matter(fs.readFileSync(file));
//   });
// };

module.exports = {
  hasMatterMarker,
  nonEmptyMatter,
  hasValidYaml,
  hasModifiedMatter,
  hasValidModifiedMatterDate,
  modifiedMatterNewerThanMTime,
  hasCreatedMatter,
  hasValidCreatedMatterDate,
  createdMatterOlderThanBirthtime,
};

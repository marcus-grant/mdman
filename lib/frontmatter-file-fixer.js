const fs = require('fs');
const graymatter = require('gray-matter');

const DEFAULT_STRINGIFY_OPTIONS = {
  flowLevel: 1,
  condenseFlow: true,
};

/**
 * Simplifies stringifying GrayMatterFile objects with defaults & passthrough options
 * @param {string} content the non-frontmatter content of the file
 * @param {string} matter the frontmatter string content of the file
 * @param {Object} options js-yaml dump options
 * @returns {string}
 */
const stringifyWithOptions = (content, data, options = {}) => {
  const fileStr = graymatter.stringify(content, data, {
    ...options,
    ...DEFAULT_STRINGIFY_OPTIONS,
  });
  return fileStr;
};

/**
 * @typedef {Object} FrontMatterFixerProps
 * @property {?graymatter.GrayMatterFile} matter graymatter file object
 * @property {?string} fileStr string of all a file's contents
 * @property {?string} filePath string of path to file
 */

/**
 * @typedef {Object} FrontMatterFixerResults
 * @property {graymatter.GrayMatterFile} matter graymatter file object
 * @property {string} fileStr string of all a file's contents
 * @property {string} filePath string of path to file
 */

/**
 * Adds the two '---' matter markers to start of fileStr
 * @function
 * @param {FrontMatterFixerProps}
 * @returns {FrontMatterFixerProps}
 */
const addMatterMarkers = ({ filePath, fileStr }) => {
  const newFileStr = ['---', '---', ...fileStr.split('\n')].join('\n');
  return { filePath, fileStr: newFileStr, matter: graymatter(newFileStr) };
};

// TODO: Test properly
const setMatterField = (key, value, { matter, filePath }) => {
  const fileStr = stringifyWithOptions(matter.content, { ...matter.data, [key]: value });
  return {
    filePath,
    fileStr,
    matter: graymatter(fileStr),
  };
};

/**
 * Replaces the given graymatter data field 'modified' with the file's stat.mtime Date
 * @param {FrontMatterFixerProps}
 * @returns {FrontMatterFixerProps}
 */
const updateModifiedMatter = ({ matter, filePath }) => (
  setMatterField('modified', new Date(fs.statSync(filePath).mtime), { matter, filePath }));

/**
 * Replaces the given graymatter data field 'created' with the file's stat.birthtime Date
 * @param {FrontMatterFixerProps}
 * @returns {FrontMatterFixerProps}
 */
const updateCreatedMatter = ({ matter, filePath }) => (
  setMatterField('created', new Date(fs.statSync(filePath).birthtime), { matter, filePath }));

const ALL_FIXERS = {
  addMatterMarkers,
  updateModifiedMatter,
  updateCreatedMatter,
};

module.exports = {
  ALL_FIXERS,
  stringifyWithOptions,
  addMatterMarkers,
  updateModifiedMatter,
  updateCreatedMatter,
};

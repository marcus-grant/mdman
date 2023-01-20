const fs = require('fs');
const graymatter = require('gray-matter');

const DEFAULT_STRINGIFY_OPTIONS = {
  flowLevel: 1,
  condenseFlow: true,
};

/**
 * Simplifies stringifying GrayMatterFile objects with defaults & passthrough options
 * @param {graymatter.GrayMatterFile} matter GrayMatterFile to stringify
 * @param {Object} options js-yaml dump options
 * @returns {string}
 */
const stringifyWithOptions = (matter, options = {}) => {
  const fileStr = matter.stringify({}, {
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
 * Adds the two '---' matter markers to start of fileStr
 * @function
 * @param {FrontMatterFixerProps}
 * @returns {FrontMatterFixerProps}
 */
const addMatterMarkers = ({ filePath, fileStr }) => {
  const newFileStr = ['---', '---', ...fileStr.split('\n')].join('\n');
  return { filePath, fileStr: newFileStr, matter: graymatter(newFileStr) };
};

/**
 * Replaces the given graymatter data field 'modified' with the file's stat.mtime Date
 * @param {FrontMatterFixerProps}
 * @returns {FrontMatterFixerProps}
 */
const updateModifiedMatter = ({ matter, filePath }) => {
  const newMatter = matter;
  newMatter.data.modified = new Date(fs.statSync(filePath).mtime);
  const fileStr = stringifyWithOptions(newMatter);
  return {
    filePath,
    fileStr,
    matter: newMatter,
  };
};

/**
 * Replaces the given graymatter data field 'created' with the file's stat.birthtime Date
 * @param {FrontMatterFixerProps}
 * @returns {FrontMatterFixerProps}
 */
const updateCreatedMatter = ({ matter, filePath }) => {
  const newMatter = matter;
  newMatter.data.created = new Date(fs.statSync(filePath).birthtime);
  const fileStr = stringifyWithOptions(newMatter);
  return {
    filePath,
    fileStr,
    matter: newMatter,
  };
};

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

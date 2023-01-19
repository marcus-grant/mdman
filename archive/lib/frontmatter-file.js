/*
  A module that treats incoming files as markup files with YAML (default) frontmatter
*/
// TODO: For this to work properly it needs to be composed like this:
// https://github.com/jonschlinkert/gray-matter/blob/master/index.js
// And with type definition like this:
// https://github.com/jonschlinkert/gray-matter/blob/master/gray-matter.d.ts
const fs = require('fs');
const graymatter = require('gray-matter');
const path = require('path');

// const fm = require('./front-matter');

const DEFAULT_STRINGIFY_OPTIONS = {
  flowLevel: 1,
  width: 120,
  condensedFlow: true,
  forcedQuotes: false,
};
const DEFAULT_OPTIONS = {
  stringifyOptions: DEFAULT_STRINGIFY_OPTIONS,
};

const isValidRelPath = (fpath) => fs.existsSync(path.join(__dirname, fpath));

const isValidAbsPath = (fpath) => fs.existsSync(fpath);

/**
 * File buffer or string containing the contents of a frontmatter file
 * @param {String} fpathOrContents A file path to a frontmatter file, or its contents
 * @returns {Buffer|String}
 */
const matterFileFromPathOrContents = (fpathOrContents) => {
  if (isValidAbsPath(fpathOrContents)) return fs.readFileSync(fpathOrContents);
  if (isValidRelPath) return fs.readFileSync(path.join(__dirname, fpathOrContents));
  return fpathOrContents;
};

const stringifyWithOptions = (stringifyFunc, options = {}) => {
  const defaults = {
    flowLevel: 1,
    width: 120,
    condensedFlow: true,
    forcedQuotes: false,
  };
  return stringifyFunc({}, { ...options, ...defaults });
};

/**
 * Returns the modified field of file's frontmatter
 * @name getModifiedDate
 * @returns {?Date}
 */
const getModifiedDate = () => this.data.modified;

module.exports = (matterFile, options = {}) => {
  let filePath;
  if (isValidAbsPath(matterFile)) filePath = matterFile;
  const gm = graymatter(matterFileFromPathOrContents(matterFile));
  const stringifyOpts = {
    ...DEFAULT_STRINGIFY_OPTIONS,
    ...options.stringifyOpts,
  };
  const setOptions = {
    stringifyOptions: stringifyOpts,
    ...DEFAULT_OPTIONS,
  };
  /**
   * FrontMatterFile
   * @namespace
   */
  return ({
    options: setOptions,
    filePath,
    getModifiedDate,
    stringify: () => stringifyWithOptions(gm.stringify, { options }),
    ...gm,
  });
};

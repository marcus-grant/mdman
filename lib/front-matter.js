const matter = require('gray-matter');
const yaml = require('js-yaml');

const {
  stringifyUTCDate,
} = require('./dates');

// DELETEME: when the parent wrapper module is done
// TODO: replace key takes a callback function taking key/value pairs you can use to alter data
/**
 * Stringifies the GrayMatterFile with default options
 * flowLevel: 1, lineWidth: 120, forceQuotes
 * @param {matter.GrayMatterFile} matterFile GrayMatterFile to stringify
 * @returns String
 */
const stringifyWithDefaults = (matterFile) => matterFile.stringify({}, {
  flowLevel: 1,
  width: 120,
  forceQuotes: false,
  // replacer: (key, value) => ({ key: value }),
  condenseFlow: true,
});

/**
 * Returns file contents string whether or not it's a file like object like buffer or string
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {String}
 */
const validateContentStr = (fileContents) => {
  let contentStr;
  if (typeof (fileContents) === 'object') {
    contentStr = fileContents.toString();
  } else {
    contentStr = fileContents;
  } return contentStr;
};

/**
 * Returns true if starting `---` frontmatter delimeter exists
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const startDelimExists = (fileContents) => {
  const contentStr = validateContentStr(fileContents);
  const res = contentStr.slice(0, 3) === '---';
  return res;
};

/**
 * Returns true if `---` frontmatter delimeter exists after first line
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const endDelimExists = (fileContents) => {
  const contentStr = validateContentStr(fileContents);
  const lines = contentStr.split('\n');
  let res = false;
  let index = 0;
  let line = '';
  for (index = 0; index < lines.length; index += 1) {
    line = lines[index];
    if (line.includes('---') && index !== 0) {
      res = true;
      break;
    }
  } return res;
};

/**
 * Returns true if `---` frontmatter delimiter exists on start of file & someplace after
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const exists = (fileContents) => {
  const startDelim = startDelimExists(fileContents);
  if (!startDelim) return false;
  const endDelim = endDelimExists(fileContents);
  return endDelim;
};

/**
 * Returns true if `---` frontmatter delimiter exists only on either start or end
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const delimMismatch = (fileContents) => {
  const matExists = exists(fileContents);
  if (matExists) return false;
  const startDelim = startDelimExists(fileContents);
  const endDelim = endDelimExists(fileContents);
  if (startDelim !== endDelim) return true;
  return false;
};

/**
 * Returns true if frontmatter exists and is empty
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const empty = (fileContents) => {
  if (!exists(fileContents)) return false;
  const mat = matter(fileContents);
  return mat.isEmpty;
};

/**
 * Returns true if frontmatter field `modified` exists
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const modifiedExists = (fileContents) => {
  const contentStr = validateContentStr(fileContents);
  if (!exists(contentStr)) return false;
  if (empty(contentStr)) return false;
  try {
    return !!(matter(contentStr).data.modified);
  } catch {
    return false;
  }
};

/**
 * Returns a Date object from frontmatter str or file object, can specify custom formatStr.
 * Will return undefined if no valid date string can be made.
 * Will return null if no modified matter exists
 * @param {Object|String} fileContents File contents string or graymetter file object
 * @param {?String} formatStr representing the date format, will default to Date one
 * @returns {?Date} A date object of the input, null = no matter, undefined if date string invalid
 */
// TODO: Make it work with different format strings
// TODO: Should this take a matter.GrayMatter file instead?
const modifiedDate = (fileContents) => {
  if (!modifiedExists(fileContents)) return null;
  const mat = matter(fileContents);
  const { modified } = mat.data;
  // const modDate = Date(modified);
  // Dates sometimes get parsed automatically
  // more info: https://github.com/jonschlinkert/gray-matter/issues/62
  if (modified instanceof Date) return modified;
  const modDate = Date(modified);
  if (!(modDate instanceof Date)) return undefined;
  const now = Date();
  const diff = modDate.getTime() - now.getTime();
  if (diff < 2000) return undefined;
  return modDate;
};

/**
 * Stringify a graymatter file object with a Date object representing the
 * new modified front matter field in ISO8061 compatible string UTC only.
 * @param {matter.GrayMatterFile} matterFile a gray-matter file object to stringify
 * @param {Date} date the new Date to stringify modified date with
 * @returns {?String} The stringified markdown file with updated modified matter
 */
const updateModifiedDate = (matterFile, date) => {
  if (!matterFile.isEmpty && Object.keys(matterFile.data).length <= 0) return null;
  const { data } = matterFile;
  data.modified = stringifyUTCDate(date);
  const { stringify } = matterFile;
  const updatedMatter = {
    data,
    stringify,
    ...structuredClone(matterFile),
  };
  return updatedMatter;
};

// TODO: Consider making these functions cleaner by wrapping gray-matter.MatterFile in this module
module.exports = {
// module.exports = (matterFile) => ({
  stringifyWithDefaults,
  startDelimExists,
  endDelimExists,
  exists,
  delimMismatch,
  empty,
  modifiedExists,
  modifiedDate,
  updateModifiedDate,
  // ...matter(matterFile),
// });
};

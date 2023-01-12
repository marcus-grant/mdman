const matter = require('gray-matter');

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
const matterStartDelimExists = (fileContents) => {
  const contentStr = validateContentStr(fileContents);
  const res = contentStr.slice(0, 3) === '---';
  return res;
};

/**
 * Returns true if `---` frontmatter delimeter exists after first line
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterEndDelimExists = (fileContents) => {
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
const matterExists = (fileContents) => {
  const startDelim = matterStartDelimExists(fileContents);
  if (!startDelim) return false;
  const endDelim = matterEndDelimExists(fileContents);
  return endDelim;
};

/**
 * Returns true if `---` frontmatter delimiter exists only on either start or end
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterDelimMismatch = (fileContents) => {
  const matExists = matterExists(fileContents);
  if (matExists) return false;
  const startDelim = matterStartDelimExists(fileContents);
  const endDelim = matterEndDelimExists(fileContents);
  if (startDelim !== endDelim) return true;
  return false;
};

/**
 * Returns true if frontmatter exists and is empty
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterEmpty = (fileContents) => {
  const exists = matterExists(fileContents);
  if (!exists) return false;
  const mat = matter(fileContents);
  return mat.isEmpty;
};

/**
 * Returns true if frontmatter field `modified` exists
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterModifiedExists = (fileContents) => {
  const contentStr = validateContentStr(fileContents);
  if (!matterExists(contentStr)) return false;
  if (matterEmpty(contentStr)) return false;
  try {
    return !!(matter(contentStr).data.modified);
  } catch {
    return false;
  }
};

module.exports = {
  matterStartDelimExists,
  matterEndDelimExists,
  matterExists,
  matterDelimMismatch,
  matterEmpty,
  matterModifiedExists,
};

const matter = require('gray-matter');

/**
 * Returns true if starting `---` frontmatter delimeter exists
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterStartDelimExists = (fileContents) => {
  let contentStr;
  if (typeof (fileContents) === 'object') {
    contentStr = fileContents.toString();
  } else {
    contentStr = fileContents;
  }
  const res = contentStr.slice(0, 3) === '---';
  return res;
};

/**
 * Returns true if `---` frontmatter delimeter exists after first line
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterEndDelimExists = (fileContents) => {
  let contentStr;
  if (typeof (fileContents) === 'object') {
    contentStr = fileContents.toString();
  } else {
    contentStr = fileContents;
  }
  const lines = contentStr.split('\n');
  let res = false;
  let index = 0;
  let line = '';
  for (index = 0; index < lines.length; index += 1) {
    line = lines[index];
    if (line.includes('---') && index !== 0) {
      res = true;
      break;
  }} return res;
};

/**
 * Returns true if `---` frontmatter delimiter exists on start of file & someplace after
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterExists = (fileContents) => {
  const startDelim = matterStartDelimExists(fileContents);
  const endDelim = matterEndDelimExists(fileContents);
  return startDelim && endDelim;
};

/**
 * Returns true if `---` frontmatter delimiter exists only on either start or end
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterDelimMismatch = (fileContents) => {
  const _matterExists = matterExists(fileContents);
  if (_matterExists) return false;
  const startDelim = matterStartDelimExists(fileContents);
  const endDelim = matterEndDelimExists(fileContents);
  if (startDelim != endDelim) return true;
  return false;
};

/**
 * Returns true if frontmatter exists and is empty
 * @param {Object|String} fileContents File contents string or graymatter object
 * @returns {boolean}
 */
const matterEmpty = (fileContents) => {
  const _matterExists = matterExists(fileContents);
  if (!_matterExists) return false;
  const _matter = matter(fileContents);
  return _matter.isEmpty;
};

module.exports = {
  matterStartDelimExists,
  matterEndDelimExists,
  matterExists,
  matterDelimMismatch,
  matterEmpty,
};

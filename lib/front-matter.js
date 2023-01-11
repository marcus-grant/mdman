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

console.log(mdFiles.map(fpath => readFileModifiedMatter(fpath)));

module.exports = {
  matterStartDelimExists,
  matterEndDelimExists,
};

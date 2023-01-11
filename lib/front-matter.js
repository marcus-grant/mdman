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

};

console.log(mdFiles.map(fpath => readFileModifiedMatter(fpath)));

module.exports = {
  matterStartDelimExists,
};

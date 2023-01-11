const fs = require('fs');
const path = require('path');
// const matter = require('gray-matter');

const DEFAULT_PATH = path.join(__dirname);

/** @function
 * List all files within an absolute path
 * @param {?String} relPath path formatted string of directory to list files of
 * @returns {?[String]} strings representing filenames of that directory
 */
const listAllFiles = (absPath = DEFAULT_PATH) => {
  try {
    return fs.readdirSync(absPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name)
      .map((fname) => path.join(absPath, fname));
  } catch {
    return undefined;
  }
};

/** @function
 * List all files within an absolute path with extension '*.md'
 * @param {?String} relPath path formatted string of directory to list files of
 * @returns {?[String]} strings representing filenames of .md extension files in dir
 */
const listAllMdFiles = (absPath = DEFAULT_PATH) => listAllFiles(absPath)
  .filter((fpath) => path.extname(fpath) === '.md');
// .filter(dirent => path.extname(dirent.name) === '.md');

module.exports = {
  listAllFiles,
  listAllMdFiles,
};

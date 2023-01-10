const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

NOTES_PATH = path.join(__dirname, '..');

/**
 * 
 * @param {?String} relPath path formatted string of directory to list files of
 * @returns [String] strings representing filenames of that directory
 */
export const listAllFiles = (absPath = NOTES_PATH) => {
  return fs.readdirSync(absPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)
    .map(fname => path.join(absPath, fname));
};

/**
 * 
 * @param {?String} relPath path formatted string of directory to list files of
 * @returns [String] strings representing filenames of .md extension files in dir
 */
export const listAllMdFiles = (absPath = NOTES_PATH) => {
  return listAllFiles(absPath)
    .filter(fpath => path.extname(fpath) === '.md');
    // .filter(dirent => path.extname(dirent.name) === '.md');
};

const mdFiles = listAllMdFiles();
console.log(mdFiles);

export default {
  listAllFiles,
  listAllMdFiles,
};
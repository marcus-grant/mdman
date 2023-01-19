const fs = require('fs');
const graymatter = require('gray-matter');
const {
  listAllMdFiles,
} = require('./file-management');
const {
  readFrontMatterFile,
} = require('./fmfile');

const DEFAULT_STRINGIFY_OPTIONS = {
  flowLevel: 1,
  width: 120,
  condensedFlow: true,
  forcedQuotes: false,
};

const stringifyWithOptions = (matter, options = {}) => matter.stringify({}, {
  ...options,
  ...DEFAULT_STRINGIFY_OPTIONS,
});

const sanitizeFiles = (
  dirPath,
  sanitationFuncs,
  stringifyOptions = {},
) => {
  const filePaths = listAllMdFiles(dirPath);
  filePaths.forEach((filePath) => {
    const matter = graymatter(fs.readFileSync(filePath));
    con;
    sanitationFuncs.forEach((sanitationFunc) => {
      sanitationFunc(fmFile);
    });
    // TODO: Consider making the FrontMatterFile capable of writing itself
    const sanitizedFMFileStr = fmFile.stringify();
    if (originalFMFileStr !== sanitizedFMFileStr) {
      // Don't write to file if no change, it will update modify time with no changes
      fs.writeFileSync(filePath, sanitizedFMFileStr);
    }
  });
};

/**
 * Update FrontMatterFile's 'modified' matter according to fs mtime
 * @function
 * @param {import('./fmfile').FrontMatterFile} fmf FrontMatterFile
 */
const updateModifiedMatter = (frontMatterFile) => {
  const fmf = frontMatterFile;
  fmf.data.modified = fs.statSync(fmf.filePath).mtime;
};

const updateCreatedMatter = (frontMatterFile) => {
  const fmf = frontMatterFile;
  fmf.data.modified = fs.statSync(fmf.filePath).birthtime;
};

module.exports = {
  sanitizeFiles,
  updateModifiedMatter,
  updateCreatedMatter,
};

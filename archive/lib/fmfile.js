const fs = require('fs');
const matter = require('gray-matter');
// const path = require('path');

// const fm = require('./front-matter');

/**
 * @typedef {Object} StringifyOptions
 * @property {Number} lineWidth Number of characters per line of frontmatter (default: 80)
 * @property {Number} flowLevel Number nested flows per collection (default: -1 (infinite))
 * @property {Boolean} condenseFlow Whether spaces should pad collection types (default: false)
 * @property {Boolean} forcedQuotes Whether quotes should be forced on strings (default: false)
 */
const DEFAULT_STRINGIFY_OPTIONS = {
  flowLevel: 1,
  lineWidth: 120,
  condenseFlow: true,
  forcedQuotes: false,
};

/**
 * Overrides GrayMatterFile's stringify function call with Stringify options
 * @param {Function} stringifyFunc GrayMatter's original stringify function or a replacement
 * @param {StringifyOptions} options Stringify options to be overridden from defaults
 * @returns {String}
 */
const stringifyFormatter = (stringifyFunc, options = {}) => stringifyFunc(
  {},
  { ...DEFAULT_STRINGIFY_OPTIONS, ...options },
);

/**
 * @typedef {Object} GrayMatterFileExtension
 * @property {String} filePath the path to the file with frontmatter (absolute)
 * @property {Function} stringify Stringifies the frontmatter file
 * @property {Function} stringifyFormatter Closure function to format graymatter's stringify()
 * @property {Function} graymatterStringify Graymatter's original stringify function
 * @property {Function} frontMatterFile Constructor function for FrontMatterFile
 *
 * @typedef {import('gray-matter').GrayMatterFile & GrayMatterFileExtension} FrontMatterFile
 */

// /**
//  * Constructor for FrontMatterFile, extending graymatter's GrayMatterFile
//  * @param {FrontMatterFile} props
//  * @returns {FrontMatterFile}
//  */
// const frontMatterFile = function({ props }) {
//   return ({
//     ...props,
//     ...this,
//   });
// }

/**
 * Construct FrontMatterFile from a file with front matter
 * @param {String} filePath Path of file to read
 * @param {StringifyOptions} stringifyOptions Options to pass to stringify function from js-yaml
 * @returns {FrontMatterFile}
 */
const readFrontMatterFile = (filePath, stringifyOptions = {}) => {
  const gm = matter(fs.readFileSync(filePath));
  return ({
    filePath,
    stringify: () => stringifyFormatter(gm.stringify, { ...stringifyOptions }),
    stringifyFormatter: () => `---\n${gm.data}\n---\n${gm.content}`,
    graymatterStringify: gm.stringify,
    // frontMatterFile,
    ...gm,
  });
};

module.exports = {
  stringifyFormatter,
  readFrontMatterFile,
};

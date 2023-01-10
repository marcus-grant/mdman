export const readFileModifiedMatter = (fname) => {
  return matter(fs.readFileSync(fname))?.data?.modified;
};

console.log(mdFiles.map(fpath => readFileModifiedMatter(fpath)));

export default {
  readFileModifiedMatter,
};

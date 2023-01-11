const {
  mkDirTesting,
  cpMockNotes,
  rmDirTesting,
} = require('./mocks');

module.exports = () => {
  rmDirTesting;
  mkDirTesting();
  cpMockNotes();
};
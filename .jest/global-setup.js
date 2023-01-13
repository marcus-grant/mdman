const {
  mkDirTesting,
  cpMockNotes,
  rmDirTesting,
} = require('./mocks');

const setTzToUtc = () => {
  process.env.tz = 'UTC';
  process.env.TZ = 'UTC';
};

const setupBaseTestingDir = () => {
  rmDirTesting();
  mkDirTesting();
  cpMockNotes();
};

module.exports = async () => {
  setTzToUtc();
  setupBaseTestingDir();
};
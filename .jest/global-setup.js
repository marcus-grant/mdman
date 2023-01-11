import {
  mkDirTesting,
  cpMockNotes,
  rmDirTesting,
} from './mocks';

module.exports = () => {
  rmDirTesting;
  mkDirTesting();
  cpMockNotes();
};
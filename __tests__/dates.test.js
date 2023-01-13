const {
  stringifyTimeNum,
} = require('../lib/dates');

describe('libs/dates.stringifyTimeNum', () => {
  let allTimeNums;
  let leadingZeroTimeNums;
  let nonLeadingZeroTimeNums;
  beforeAll(() => {
    allTimeNums = [...Array(60).keys()]; // [0..59]
    leadingZeroTimeNums = [...Array(10).keys()]; // [0..9]
    nonLeadingZeroTimeNums = allTimeNums.filter((n) => (
      !leadingZeroTimeNums.includes(n))); // [10..59]
  });

  it('All return strings evaluate back to corresponding number', () => {
    allTimeNums.forEach((n, i) => {
      expect(parseInt(stringifyTimeNum(n), 10)).toEqual(i);
    });
  });

  it('All returns are strings', () => {
    allTimeNums.forEach((n) => {
      expect(typeof stringifyTimeNum(n)).toEqual('string');
    });
  });

  it('All numbers < 10 have leading zero characters', () => {
    leadingZeroTimeNums.forEach((n) => {
      expect(stringifyTimeNum(n)[0]).toEqual('0');
    });
  });

  it('All numbers >= 10 have no leading zero characters', () => {
    nonLeadingZeroTimeNums.forEach((n) => {
      expect(stringifyTimeNum(n)[0]).not.toBe('0');
    });
  });
});


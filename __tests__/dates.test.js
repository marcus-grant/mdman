const {
  stringifyTimeNum,
  stringifyUTCDate,
} = require('../lib/dates');

describe('Ensure TZ is set to UTC for this test suite', () => {
  it('timeZoneOffset is 0', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});

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

describe('libs/dates.stringifyUTCDate', () => {
  describe('Dates become correct YYYY-MM-ddThh:mm:ssZ string', () => {
    it('2000-06-14T06:15:23Z', () => {
      // Mix of leading zeroes and an old '00 date
      expect(stringifyUTCDate(new Date(Date.UTC(2000, 5, 14, 6, 15, 23))))
        .toBe('2000-06-14T06:15:23Z');
    });

    it('2022-12-31T23:59:59Z', () => {
      // No leading zeroes, except year which shouldn't ever have them
      expect(stringifyUTCDate(new Date(Date.UTC(2022, 11, 31, 23, 59, 59))))
        .toBe('2022-12-31T23:59:59Z');
    });

    it('2023-01-01T00:00:00Z', () => {
      // Nearly all leading zeroes except year in 1st sec of '23
      expect(stringifyUTCDate(new Date(Date.UTC(2023, 0, 1, 0, 0, 0))))
        .toBe('2023-01-01T00:00:00Z');
    });
  });
});

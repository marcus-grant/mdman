/**
 * Turns numbers into valid date unit strings, including leading zeros if < 10
 * @param {Number} num Number to be stringified
 * @returns {String} A string of the number, with leading zero if < 10
 */
const stringifyTimeNum = (num) => {
  if (num < 10) {
    return `0${num}`;
  } return `${num}`;
};

/**
 * Takes a Date object and pulls out UTC time units to form string YYYY-MM-ddThh:mm:ssZ
 * @param {Date} date Date object to transform into string
 * @returns {String}
 */
const stringifyUTCDate = (date) => {
  const yyyy = stringifyTimeNum(date.getUTCFullYear());
  const mM = stringifyTimeNum(date.getUTCMonth() + 1); // months 0-indexed
  const dd = stringifyTimeNum(date.getUTCDate());
  const hh = stringifyTimeNum(date.getUTCHours());
  const mm = stringifyTimeNum(date.getUTCMinutes());
  const ss = stringifyTimeNum(date.getUTCSeconds());
  const dateStr = `${yyyy}-${mM}-${dd}T${hh}:${mm}:${ss}Z`;
  return dateStr;
};

module.exports = {
  stringifyTimeNum,
  stringifyUTCDate,
};

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

module.exports = {
  stringifyTimeNum,
};

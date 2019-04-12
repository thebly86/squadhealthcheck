export default {
  isAlphaNumeric(str) {
    // Allow a-z A-Z 0-9 and spaces
    const regex = new RegExp(/^(?![ \d])(?:[a-zA-Z\d ']+)$/);
    return regex.test(str);
  },

  isEmpty(str) {
    return str.length === 0;
  }
};

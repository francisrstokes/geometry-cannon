const { choose } = require('creative-code-toolkit');
const flutter = require('./flutter');
const offset = require('./offset');

const variations = {
  flutter,
  offset
};

module.exports = () => {
  const variation = choose(Object.keys(variations));
  const result = variations[variation]();
  return Object.assign({ type: variation }, result);
};

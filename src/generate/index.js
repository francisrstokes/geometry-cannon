const { choose } = require('creative-code-toolkit');
const flutter = require('./flutter');
const offset = require('./offset');
const kscope = require('./kscope');

const variations = {
  flutter,
  offset,
  kscope
};

module.exports = () => {
  const variation = choose(Object.keys(variations));
  const result = variations[variation]();
  return Object.assign({ type: variation }, result);
};

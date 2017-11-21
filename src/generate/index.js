const { chooseWithout } = require('creative-code-toolkit');
const { getState, writeState } = require('./util');
const flutter = require('./flutter');
const offset = require('./offset');
const kscope = require('./kscope');
const hwave = require('./hwave');
const pdj = require('./pdj');

const variations = {
  hwave,
  flutter,
  offset,
  kscope,
  pdj
};

module.exports = async () => {
  const state = await getState();
  const variation = chooseWithout(Object.keys(variations), state.last);
  state.last = variation;
  await writeState(state);
  const result = variations[variation]();
  return Object.assign({ type: variation }, result);
};

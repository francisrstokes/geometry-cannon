const { chooseWithout } = require('creative-code-toolkit');
const { getState, writeState } = require('./util');
const flutter = require('./flutter');
const offset = require('./offset');
const kscope = require('./kscope');
const hwave = require('./hwave');
const pdj = require('./pdj');
const eye = require('./eye');
const singrid = require('./singrid');
const mandala = require('./mandala');

const variations = {
  // offset,
  mandala,
  eye,
  hwave,
  flutter,
  kscope,
  pdj,
  singrid
};

module.exports = async () => {
  const state = await getState();
  const variation = chooseWithout(Object.keys(variations), state.last);
  state.last = variation;
  await writeState(state);
  const result = variations[variation]();
  return Object.assign({ type: variation }, result);
};

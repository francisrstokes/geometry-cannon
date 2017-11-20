const microcan = require('microcan');
const { lstat, readFile, writeFile } = require('fs');
const { promisify } = require('util');
const lstatAsync = promisify(lstat);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const injectCtx = (ctx) => {
  return Object.keys(microcan)
    .reduce((acc, key) => {
      acc[key] = (...args) => microcan[key](ctx, ...args);
      return acc;
    }, {});
};

const getBase64 = (canvas) => {
  return canvas.toDataURL().replace('data:image/png;base64,', '');
}

const fileExists = (file) => new Promise((resolve) => {
  lstatAsync(file)
    .then(() => resolve(true))
    .catch(() => resolve(false));
});

const writeState = (state) =>
  writeFileAsync('./state.json', JSON.stringify(state));

const getState = async () => {
  const exists = await fileExists('./state.json');
  if (exists) {
    return await readFileAsync('./state.json').then(JSON.parse);
  }
  const state = {
    last: ''
  }
  await writeState(state);
  return state;
};

module.exports = {
  injectCtx,
  getBase64,
  getState,
  writeState
};

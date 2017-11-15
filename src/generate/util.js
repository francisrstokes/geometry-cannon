const microcan = require('microcan');

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

module.exports = {
  injectCtx,
  getBase64
};

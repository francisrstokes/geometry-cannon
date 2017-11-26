const { createCanvas } = require('canvas');
const vec = require('vec-la');
const { genArray, mapRange, rndB, rndIntB } = require('creative-code-toolkit');
const { poly } = require('microcan');
const { injectCtx, getBase64 } = require('./util');
const { promisify } = require('util');
const writeFileAsync = promisify(require('fs').writeFile);


const w = 500;
const h = 500;

const canvas = createCanvas(w, h);
const ctx = canvas.getContext('2d');
const {
  background,
  fill,
  rect
} = injectCtx(ctx);


module.exports = () => {
  const cellRowCount = 40;
  const gridSize = w;
  const R = gridSize / 2;
  const sqSize = gridSize / cellRowCount;
  const color = [
    rndIntB(100, 255),
    rndIntB(100, 255),
    rndIntB(100, 255)
  ];
  const iColor = color.map(c => 255 - c);
  const co = [
    Number(mapRange(Math.random(), 0, 1, 0.5, 1).toFixed()),
    Number(mapRange(Math.random(), 0, 1, 0.5, 1).toFixed()),
    Number(mapRange(Math.random(), 0, 1, 0.5, 1).toFixed())
  ];

  const getFuncArgs = (x, y, t) => {
    const X = (x - cellRowCount / 2) * sqSize;
    const Y = (y - cellRowCount / 2) * sqSize;
    const h = Math.sqrt((X * X) + (Y * Y));
    const a = Math.atan(h);

    return [
      x,
      y,
      t,
      (x - cellRowCount / 2) * sqSize,
      (y - cellRowCount / 2) * sqSize,
      a
    ];
  };


  const gridFunctions = [
    (x, y, t, X, Y, a) => Math.sin((t / 2) * (a * a * a * a) + ((X * X) + (Y * Y)) / (a * t)),
    (x, y, t, X, Y, a) => Math.sin((t / 2) * (a * a * a * a) + (X * X) + (Y * Y)),
    (x, y, t, X, Y, a) => Math.sin((t) * (a * a * a * a)),
    (x, y, t, X, Y, a) => (Math.sin(Y % y + a * t * a)) / 1,
    (x, y, t, X, Y, a) => (Math.cos(x % t % t % a - a - x + a * X + t - a * X / y % y - x / X % a / X)) / 1,
    (x, y, t, X, Y, a) => (Math.sin(Y % Y * y * Y + x / t - Y + Y % Y - t * a)) / 1,
    (x, y, t, X, Y, a) => (Math.cos((Y % X - y) + t * a + X % Y - x * a + y * a)) / 1,
    (x, y, t, X, Y, a) => Math.sin(t + (x + y / t / y - y * X / Y + a * t)),
    (x, y, t, X, Y, a) => Math.cos(t + x + Y / X - X - X % Y - a / t),
    (x, y, t, X, Y, a) => {
      const v = vec.rotate([
        X,
        Y
      ], t / 50);
      const _X = v[0];
      const _Y = v[1];
      return (Math.sin(t + _X + _Y) + (Math.sin(t + (a * a * a) * R) + Math.cos(t / a)) / 2) / 2;
    },
    (x, y, t, X, Y, a) => Math.sin(t + y % t - X % Y - Y / Y + X / t - X * a % Y),
    (x, y, t, X, Y) => Math.sin(t + (1 / X) * (Y * Y)),
    (x, y, t, X, Y, a) => Math.sin(t + (x + Y) / a) + Math.cos(t * (a / X / Y) + (x + Y)),
    (x, y, t, X, Y, a) => Math.sin(t + (a * a * a) * R) + Math.cos(t / a),
    (x, y, t, X, Y, a) => Math.sin(t + (x + Y) + a) + Math.cos(t * 1.5 + (x + Y) + a),
    (x, y, t, X, Y) => Math.sin(Math.sin(t + (X) % (Y)) + Math.cos(t + (Y) % (X))),
    (x, y, t, X, Y, a) => Math.sin(t + (a * a) * R) * Math.cos(t + Math.sin(x + y)),
    (x, y, t) => Math.sin(t + (x + 1) * (y + 1)) * Math.cos(t + (x + 1) * (y + 1)),
    (x, y, t) => Math.sin(t + x - y) + Math.sin(t + x + y),
    (x, y, t) => Math.sin(Math.sin(t + (x + 1) * (y + 1)) + Math.cos(t + (x + 1) * (y + 1))),
    (x, y, t, X, Y, a) => Math.sin(t + (a * a * a) * R)
  ];


  const gfp = rndIntB(0, gridFunctions.length - 1);
  const clk = rndIntB(0, 1000000);

  const drawCell = (cellValue, x, y) => {
    const c = mapRange(cellValue, -1, 1, 1, 0.1);
    const col = [...color.map((x, i) => (x * c * co[i]) >> 0), 1];
    fill(...col);
    const drawSize = mapRange(cellValue, -1, 1, 0, sqSize) >> 0;
    const offset = mapRange(drawSize, 0, sqSize, sqSize / 2, 0) >> 0;
    rect([(x * sqSize) + offset, (y * sqSize) + offset], drawSize, drawSize);
  }

  /** Setup **/

  const params = {
    gfp,
    clk,
    color,
    co
  };

  /** Draw **/
  background();
  background(...iColor, 0.2);

  const draw = (frame) => {
    const t = frame / 10;
    for (let y = 0; y < gridSize / sqSize; y++) {
      for (let x = 0; x < gridSize / sqSize; x++) {
        const cellValue = gridFunctions[gfp](...getFuncArgs(x, y, t));
        drawCell(cellValue, x, y);
      }
    }
  }
  draw(clk);

  const buf = canvas.toBuffer();
  writeFileAsync('out.png', buf).then(() => {
    console.log(JSON.stringify(params));
  });

  return {
    image: getBase64(canvas),
    params
  };
};

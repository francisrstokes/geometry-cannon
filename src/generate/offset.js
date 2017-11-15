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
  stroke,
  strokeWeight,
  noFill,
  drawPoly,
  ellipse
} = injectCtx(ctx);


module.exports = () => {

  /** Setup **/
  const alpha = Number(mapRange(Math.random(), 0, 1, 0.5, 1).toFixed(3));
  const sw = rndIntB(1, 4);
  const color = [
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF)
  ];
  const gs = rndIntB(10, 15);
  const xw = w / gs;
  const yw = h / gs;

  const grid = genArray(gs).map((_, y) =>
    genArray(gs).map((_, x) => [
      (x * xw) + (xw / 4) + (y % 2 === 0 ? xw / 2 : 0),
      (y * yw) + (yw / 2)
    ])
  );

  const r = rndIntB(20, 90);
  const cr = Number(rndB(0, 5).toFixed(3));
  const n = rndIntB(3, 7);
  const s = poly(0, 0, n, r);

  const params = {
    r,
    cr,
    n,
    gs,
    color,
    alpha,
    sw
  };

  stroke(...color, alpha);
  strokeWeight(sw);

  /** Draw **/
  background();
  noFill();

  const draw = (frameCount) => {
    grid.forEach(row => row.forEach(point => {
      ellipse(point, cr);
      drawPoly(s.map(p => vec.add(point, p)));
    }));
  }
  draw(0);

  const buf = canvas.toBuffer();
  writeFileAsync('out.png', buf).then(() => {
    console.log('Wrote');
  });

  return {
    image: getBase64(canvas),
    params
  };
};

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
  const sw = rndIntB(1, 10);
  const color = [
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF)
  ];

  const ns = rndIntB(2, 8);
  const ss = genArray(ns).map(() => rndIntB(2, 8));
  const sr = ss.map(() => rndIntB(10, 100));
  const sp = ss.map(() => [
    Number(rndB(0, Math.PI / 4).toFixed(3)),
    Number(rndB(0, w / 2).toFixed(3))
  ]);

  const params = {
    color,
    alpha,
    sw,
    ns,
    ss,
    sr,
    sp
  };

  stroke(...color, alpha);
  strokeWeight(sw);

  /** Draw **/
  background();
  noFill();

  const draw = (frameCount) => {
    ss.forEach((s, i) => {
      const pos = [
        Math.cos(sp[i][0]) * sp[i][1],
        Math.sin(sp[i][0]) * sp[i][1]
      ];
      // const npos = pos.map(c => -c);
      const ply = poly(...pos, s, sr[i]);

      const m2 = vec.matrixBuilder()
        .scale(-1, 1)
        .translate(w / 2, h / 2)
        .get();
      const m3 = vec.matrixBuilder()
        .scale(-1, -1)
        .translate(w / 2, h / 2)
        .get();
      const m4 = vec.matrixBuilder()
        .scale(1, -1)
        .translate(w / 2, h / 2)
        .get();

      drawPoly(ply.map(p => vec.add(p, [w / 2, h / 2])))
      drawPoly(ply.map(vec.fTransform(m2)));
      drawPoly(ply.map(vec.fTransform(m3)));
      drawPoly(ply.map(vec.fTransform(m4)));
    });
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

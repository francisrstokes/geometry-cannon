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
  line
} = injectCtx(ctx);


module.exports = () => {

  /** Setup **/
  const alpha = Number(mapRange(Math.random(), 0, 1, 0.01, 0.05).toFixed(3));
  const sw = rndIntB(1, 30);
  // const color = [
  //   rndIntB(0, 0xFF),
  //   rndIntB(0, 0xFF),
  //   rndIntB(0, 0xFF)
  // ];
  const color = [255, 255, 255];

  // const frames = rndIntB(1, 10);
  const f = 20;
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

  strokeWeight(sw);

  /** Draw **/
  background();
  noFill();

  const draw = (frameCount) => {
    const a = (Math.PI * 2) * (frameCount / f);
    ss.forEach((s, i) => {
      const pos = [
        Math.cos(sp[i][0]) * sp[i][1],
        Math.sin(sp[i][0]) * sp[i][1]
      ];
      // const npos = pos.map(c => -c);
      // const fr = frameCount / frames;
      // stroke(...color, alpha * (1 - fr));

      const r = sr[i];// (1 - fr) * sr[i];
      const ply = poly(...pos, s, r);

      const m1 = vec.matrixBuilder()
        .rotate(a)
        .translate(w / 2, h / 2)
        .get();

      const m2 = vec.matrixBuilder()
        .scale(-1, 1)
        .rotate(a)
        .translate(w / 2, h / 2)
        .get();
      const m3 = vec.matrixBuilder()
        .scale(-1, -1)
        .rotate(a)
        .translate(w / 2, h / 2)
        .get();
      const m4 = vec.matrixBuilder()
        .scale(1, -1)
        .rotate(a)
        .translate(w / 2, h / 2)
        .get();

      const tl = ply.map(vec.fTransform(m1));
      const tr = ply.map(vec.fTransform(m2));
      const br = ply.map(vec.fTransform(m3));
      const bl = ply.map(vec.fTransform(m4));

      strokeWeight(1);
      stroke(...color, 0.045);
      tl.forEach((p, i) => {
        line(tl[i], br[i]);
        line(bl[i], tr[i]);
        line(tl[i], bl[i]);
        line(tr[i], br[i]);
        line(tl[i], tr[i]);
        line(bl[i], br[i]);
      });

      strokeWeight(sw);
      stroke(...color, alpha);
      drawPoly(tl);
    });
  }
  genArray(f).map((_, i) => draw(i));

  const buf = canvas.toBuffer();
  writeFileAsync('out.png', buf).then(() => {
    console.log('Wrote');
  });

  return {
    image: getBase64(canvas),
    params
  };
};

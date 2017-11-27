const { createCanvas } = require('canvas');
const vec = require('vec-la');
const { genArray, mapRange, rndB, rndIntB, choose } = require('creative-code-toolkit');
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
  line
} = injectCtx(ctx);

const fixTo = (dec, n) => Number(n.toFixed(dec));
const fix3 = (n) => fixTo(3, n);

module.exports = () => {

  /** Setup **/
  const alpha = 0.1;
  const sw = 1;

  const ratio = fix3(rndB(1.2, 3));

  const r1 = 250; // fix3(rndB(150, 250));
  const r2 = fix3(r1 / ratio);
  const s1 = fix3(rndB(1, 50));
  const s2 = fix3(rndB(1, 50));

  const color = [255, 255, 255];
  const cMod = choose([0, 1, 2]);

  const f = 2000;

  const params = {
    cMod,
    ratio,
    s1,
    s2
  };

  strokeWeight(sw);
  stroke(...color, alpha);

  /** Draw **/
  background();
  noFill();

  const getColor = (c) => {
    const colorCopy = [...color];
    colorCopy[cMod] = c >> 0;
    return colorCopy;
  };

  const draw = (frameCount) => {
    const a = (Math.PI / 64) * frameCount;
    const p1 = [
      (w / 2) + Math.cos(a * s1) * r1,
      (h / 2) + Math.sin(a * s1) * r1
    ];

    const p2 = [
      (w / 2) + Math.cos(a * s2) * r2,
      (h / 2) + Math.sin(a * s2) * r2
    ];

    const d = vec.dist(p1, p2);
    const c = mapRange(d, 0, r1 + r2, 0, 255);
    stroke(...getColor(c), alpha)
    line(p1, p2);
  }
  genArray(f).map((_, i) => draw(i));

  const buf = canvas.toBuffer();
  writeFileAsync('out.png', buf).then(() => {
    console.log(params);
  });

  return {
    image: getBase64(canvas),
    params
  };
};

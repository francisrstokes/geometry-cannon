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
  ellipse
} = injectCtx(ctx);


module.exports = () => {

  /** Setup **/
  const sw = rndIntB(1, 4);
  const color = [
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF)
  ];

  const n = rndIntB(3, 20);
  const f = rndIntB(10, 100);
  const alpha = Number(mapRange(Math.random(), 0, 1, 0.025, 0.05).toFixed(3));
  const r = Number((rndB(100, 250)).toFixed(3));
  const ir = Number((Math.random() * Math.PI).toFixed(3));
  const r2min = (r / n) * Math.PI;
  const r2 = Number((rndB(r2min, r).toFixed(3)));
  const ir2 = Number((Math.random() * Math.PI * 2).toFixed(3));
  const r3min = 10;
  const rr = Number((mapRange(Math.random(), 0, 1, 0.01, 0.1)).toFixed(3));
  const r3 = Number((rndB(r3min, r / 2)).toFixed(3));
  const sx = Number((Math.random() * 2).toFixed(3));
  const sy = Number((Math.random() * 2).toFixed(3));

  const params = {
    r,
    rr,
    r2,
    r3,
    ir,
    ir2,
    n,
    f,
    sx,
    sy,
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
    const tm = vec.matrixBuilder()
      .rotate(frameCount * rr)
      .scale(sx, sy)
      .translate(w / 2, h / 2)
      .get();

    // ellipse([w / 2, h / 2], r);
    genArray(n).forEach((_, i) => {
      const a = ((Math.PI * 2) / n) * i;
      const p = vec.transform([
        Math.cos(a) * r,
        Math.sin(a) * r
      ], tm);

      ellipse(p, r2min)
      ellipse(vec.rotatePointAround(p, [w / 2, h / 2], ir), r2);
      ellipse(vec.rotatePointAround(p, [w / 2, h / 2], ir2), r3);
    });
  }
  genArray(f).forEach((_, i) => draw(i));

  const buf = canvas.toBuffer();
  writeFileAsync('out.png', buf).then(() => {
    console.log(JSON.stringify(params));
  });

  return {
    image: getBase64(canvas),
    params
  };
};

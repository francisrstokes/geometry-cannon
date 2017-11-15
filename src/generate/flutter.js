const { createCanvas } = require('canvas');
const vec = require('vec-la');
const { sinMap, genArray, mapRange, rndB, rndIntB } = require('creative-code-toolkit');
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
  drawPoly
} = injectCtx(ctx);


module.exports = () => {
  const sw = rndB(1, 8);
  const sfd = rndB(10, 60);
  const s1 = rndB(10, 100);
  const s2 = rndB(100, 250);
  const nfd = rndB(20, 250);
  const n1 = rndIntB(1, 4);
  const n2 = rndIntB(1, 5);
  const alpha = mapRange(Math.random(), 0, 1, 0.01, 0.1);
  const sc1 = mapRange(Math.random(), 0, 1, -5, 5);
  const sc2 = mapRange(Math.random(), 0, 1, -5, 5);
  const frames = rndIntB(300, 500);
  const color = [
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF)
  ];

  const params = {
    sw,
    sfd,
    s1,
    s2,
    nfd,
    n1,
    n2,
    alpha,
    sc1,
    sc2,
    frames,
    color
  };

  /** Setup **/
  stroke(...color, alpha);
  strokeWeight(sw);

  /** Draw **/
  background();
  noFill();

  const draw = (frameCount) => {
    // background();
    const s = sinMap(frameCount, sfd, s1, s2);
    const m = vec.matrixBuilder()
      .scale(s, s)
      .rotate(frameCount / 120)
      .shear(sc1 / (frameCount / 10), sc2 / (frameCount / 10))
      .translate(w / 2, h / 2)
      .get();

    const n = sinMap(frameCount, nfd, n1, n2);

    const ply = poly(0, 0, n, 1).map(vec.fTransform(m));
    drawPoly(ply);
  }

  genArray(frames).map((_, i) => draw(i));

  const buf = canvas.toBuffer();
  writeFileAsync('out.png', buf).then(() => {
    console.log('Wrote');
  });

  return {
    image: getBase64(canvas),
    params
  };
}
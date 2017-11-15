const { createCanvas } = require('canvas');
const { genArray, mapRange, rndIntB } = require('creative-code-toolkit');
const { injectCtx, getBase64 } = require('./util');
const { promisify } = require('util');
const writeFileAsync = promisify(require('fs').writeFile);

const w = 500;
const h = 500;

const canvas = createCanvas(w, h);
const ctx = canvas.getContext('2d');
const {
  line,
  background,
  stroke,
  strokeWeight,
  noFill
} = injectCtx(ctx);


module.exports = () => {

  /** Setup **/
  const alpha = Number(mapRange(Math.random(), 0, 1, 0.01, 0.05).toFixed(3));
  const sw = rndIntB(1, 40);
  const sw2 = rndIntB(1, 40);
  const color = [
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF)
  ];
  const color2 = color.map(c => 255 - c);

  const f = rndIntB(60, 60);
  const n = rndIntB(20, 50);
  const yh = h / n;
  const nw = rndIntB(1, 50);
  const ws = genArray(nw).map((_, i) =>
    Number((Math.random() * 10).toFixed(3))
  );

  const waveFunc = (x) => ws.reduce((acc, coef, i) => {
    return acc + (coef * Math.sin(coef * x * i));
  });

  const params = {
    color,
    alpha,
    sw,
    sw2,
    f,
    n,
    nw
  };

  stroke(...color, alpha);

  /** Draw **/
  background();
  noFill();

  const draw = (frameCount) => {
    genArray(n).forEach((_, i) => {
      const ir = mapRange(i, 0, n, 0, Math.PI * 2);
      const wave = waveFunc(ir + (frameCount / 20));
      const displacement = mapRange(wave, -nw, nw, 0, w / 2);

      const lines = [
        [
          [0, i * yh + yh / 2],
          [w / 2 - displacement, i * yh + yh / 2]
        ],
        [
          [w, i * yh + yh / 2],
          [w / 2 + displacement, i * yh + yh / 2]
        ]
      ];
      const line3 = [
        lines[0][1],
        lines[1][1]
      ];
      stroke(...color, alpha);
      strokeWeight(sw);
      lines.map(lineDef => line(...lineDef));

      stroke(...color2, alpha * 0.5);
      strokeWeight(sw2);
      line(...line3);
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

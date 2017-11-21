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
  fill,
  ellipse,
  noStroke,
  background
} = injectCtx(ctx);


module.exports = () => {
  const alpha = 0.08;
  const color = [
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF),
    rndIntB(0, 0xFF)
  ];

  noStroke();
  background();
  fill(...color, alpha);

  const findAttractorParams = () => {
    console.log('searching for interesting parameters...');
    let foundInteresting = false;
    const testIterations = 1000;
    let a, b, c, d;
    while (!foundInteresting) {
      a = Number(mapRange(Math.random(), 0, 1, -3, 3).toFixed(4));
      b = Number(mapRange(Math.random(), 0, 1, -3, 3).toFixed(4));
      c = Number(mapRange(Math.random(), 0, 1, -3, 3).toFixed(4));
      d = Number(mapRange(Math.random(), 0, 1, -3, 3).toFixed(4));
      let p = [1, 1];
      const unique = [];

      genArray(testIterations).map(() => {
        p = [
          Math.sin((p[0] * a) + (p[1] * c)),
          Math.cos((p[1] * b) + (p[0] * d))
        ];
        const dp = p.map(c => mapRange(c, -1, 1, 0, w) >> 0);
        const inUnique = unique.some(up => {
          return up[0] === dp[0] && up[1] === dp[1];
        });
        if (!inUnique) unique.push(dp);
      });
      console.log(`found ${unique.length} unique points`);
      if (unique.length > testIterations * 0.9) foundInteresting = true;
    }

    return { a, b, c, d };
  }

  const { a, b, c, d } = findAttractorParams();
  console.log(a, b, c, d)
  let p = [1, 1];
  const f = 300000;
  let i = 0;
  while (i++ < f) {
    p = [
      Math.sin((p[0] * a) + (p[1] * c)),
      Math.cos((p[1] * b) + (p[0] * d))
    ];
    const dp = p.map(c => mapRange(c, -1, 1, 0, w) >> 0);
    ellipse(dp, 1);
  }

  const buf = canvas.toBuffer();
  writeFileAsync('out.png', buf).then(() => {
    console.log('Wrote');
  });

  return {
    image: getBase64(canvas),
    params: { a, b, c, d, color }
  };
};

const generate = require('./generate');
const tweet = require('./tweet');

if (process.argv.length >= 3 && process.argv[2] === '--post-initial') {
  generate().then(tweet);
}

const FOUR_HOURS = 1000 * 60 * 4;
setInterval(() => {
  generate().then(tweet);
}, FOUR_HOURS);
const config = require('./config')
const Twit = require('twit');
const T = new Twit(config);

module.exports = ({ image, type, params }) => new Promise((resolve, reject) => {
  /* eslint-disable camelcase */
  const metadataCreateCb = (mediaIdStr) =>
    (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log('Done creating metadata...');
        const tweetStr = `${type}:${JSON.stringify(params).replace(/"/g, '')}`;
        console.log(tweetStr)
        const tweet = {
          status: tweetStr,
          media_ids: [
            mediaIdStr
          ]
        };

      console.log('Posting tweet...');
      T.post('statuses/update', tweet, (err) => {
        if (err) {
          console.log('Something went wrong while posting!');
          console.log(err);
          reject(err);
        }
        resolve();
      });
    }
  };

  const mediaUploadCb = (err, data) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      console.log('Done uploading.');
      const mediaIdStr = data.media_id_string;
      const meta_params = {
        media_id: mediaIdStr,
        alt_text: { text: 'Generated Image' }
      };

      console.log('Creating metadata...');
      T.post('media/metadata/create', meta_params, metadataCreateCb(mediaIdStr));
    }
  };

  console.log('Starting upload');
  T.post('media/upload', { media_data: image }, mediaUploadCb);
  /* eslint-enable camelcase */
});

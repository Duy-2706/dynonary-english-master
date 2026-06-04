'use strict';
const https = require('https');

const PIXABAY_KEY = process.env.PIXABAY_API_KEY || '';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch an image URL for a word from Pixabay.
 * Returns null when no key is configured or no result found.
 */
exports.fetchImageForWord = async (word) => {
  if (!PIXABAY_KEY || PIXABAY_KEY === 'your-pixabay-api-key') return null;

  try {
    const q = encodeURIComponent(word.toLowerCase());
    const url =
      `https://pixabay.com/api/?key=${PIXABAY_KEY}` +
      `&q=${q}&image_type=photo&safesearch=true&per_page=3`;

    const json = await httpsGet(url);
    if (json && Array.isArray(json.hits) && json.hits.length > 0) {
      return json.hits[0].webformatURL || null;
    }
  } catch (_) {}

  return null;
};

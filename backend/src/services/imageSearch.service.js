'use strict';
const https = require('https');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DynonaryApp/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch a permanent image URL for a word from Wikipedia.
 * Returns null when no image found.
 * Wikipedia thumbnail URLs are permanent CDN links (upload.wikimedia.org).
 */
exports.fetchImageForWord = async (word) => {
  try {
    const q = encodeURIComponent(word.toLowerCase());
    const json = await httpsGet(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${q}`,
    );
    if (json && json.thumbnail && json.thumbnail.source) {
      return json.thumbnail.source.replace(/\/\d+px-/, '/640px-');
    }
  } catch (_) {}

  return null;
};
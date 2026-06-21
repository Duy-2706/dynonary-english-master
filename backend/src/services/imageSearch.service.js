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

exports.fetchImageForWord = async (word) => {
  const q = encodeURIComponent(word.toLowerCase().trim());

  // 1. Wikipedia REST summary
  try {
    const json = await httpsGet(`https://en.wikipedia.org/api/rest_v1/page/summary/${q}`);
    if (json?.thumbnail?.source) return json.thumbnail.source;
  } catch (_) {}

  // 2. Wikipedia search — only titles starting with the word (avoids person surnames)
  try {
    const wordLower = word.toLowerCase().trim();
    const json = await httpsGet(
      `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrlimit=10&prop=pageimages&pithumbsize=500&format=json`,
    );
    const pages = Object.values(json?.query?.pages || {});
    const withImage = pages.filter((p) => p.thumbnail?.source);
    const relevant = withImage.filter((p) => p.title.toLowerCase().startsWith(wordLower));
    const src = relevant[0]?.thumbnail?.source;
    if (src) return src;
  } catch (_) {}

  return null;
};
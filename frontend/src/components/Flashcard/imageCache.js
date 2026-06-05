const cache = {};

function fallbackUrl(word) {
  return `https://loremflickr.com/640/480/${encodeURIComponent(word.toLowerCase())}`;
}

async function fetchWikipediaImage(word) {
  const q = encodeURIComponent(word.toLowerCase());
  // pageimages API returns the representative image for the Wikipedia article
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${q}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
  );
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  const thumb = pages[0]?.thumbnail?.source;
  return thumb || null;
}

function loadIntoCache(word) {
  if (!word || cache[word]) return;
  cache[word] = 'loading';

  fetchWikipediaImage(word)
    .then((src) => {
      const url = src || fallbackUrl(word);
      const img = new window.Image();
      img.onload = () => { cache[word] = img.src; };
      img.onerror = () => {
        // Wikipedia image failed, use loremflickr
        const fb = fallbackUrl(word);
        const img2 = new window.Image();
        img2.onload = () => { cache[word] = img2.src; };
        img2.onerror = () => { cache[word] = fb; };
        img2.src = fb;
      };
      img.src = url;
    })
    .catch(() => {
      cache[word] = fallbackUrl(word);
    });
}

export function prefetchImage(word) {
  if (!word || cache[word]) return;
  loadIntoCache(word);
}

export function getCachedImage(word) {
  const v = cache[word];
  return v && v !== 'loading' ? v : null;
}

export function ensureImage(word, onReady) {
  if (!word) return;
  const v = cache[word];
  if (v && v !== 'loading') { onReady(v); return; }

  if (!v) loadIntoCache(word);

  const poll = setInterval(() => {
    const cur = cache[word];
    if (cur && cur !== 'loading') {
      clearInterval(poll);
      onReady(cur);
    }
  }, 80);

  setTimeout(() => {
    clearInterval(poll);
    if (!cache[word] || cache[word] === 'loading') {
      cache[word] = fallbackUrl(word);
      onReady(cache[word]);
    }
  }, 8000);
}

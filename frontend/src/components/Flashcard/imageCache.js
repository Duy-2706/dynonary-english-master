const cache = {};

async function fetchWikipediaImage(word) {
  const q = encodeURIComponent(word.toLowerCase());

  // 1. Direct title match
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${q}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
    );
    const data = await res.json();
    const pages = Object.values(data?.query?.pages || {});
    const thumb = pages[0]?.thumbnail?.source;
    if (thumb) return thumb;
  } catch (_) {}

  // 2. Search-based — only titles starting with the word (avoids person surnames)
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrlimit=10&prop=pageimages&pithumbsize=500&format=json&origin=*`,
    );
    const data = await res.json();
    const pages = Object.values(data?.query?.pages || {});
    const wordLower = word.toLowerCase();
    const withImage = pages.filter((p) => p.thumbnail?.source);
    const relevant = withImage.filter((p) => p.title.toLowerCase().startsWith(wordLower));
    const src = (relevant[0] || null)?.thumbnail?.source;
    if (src) return src;
  } catch (_) {}

  return null;
}

function loadIntoCache(word) {
  if (!word || cache[word] !== undefined) return;
  cache[word] = 'loading';

  fetchWikipediaImage(word)
    .then((src) => {
      if (!src) { cache[word] = ''; return; }
      const img = new window.Image();
      img.onload = () => { cache[word] = img.src; };
      img.onerror = () => { cache[word] = ''; };
      img.src = src;
    })
    .catch(() => { cache[word] = ''; });
}

export function prefetchImage(word) {
  if (!word || cache[word] !== undefined) return;
  loadIntoCache(word);
}

export function getCachedImage(word) {
  const v = cache[word];
  return v && v !== 'loading' ? v : null;
}

export function ensureImage(word, onReady) {
  if (!word) return;
  const v = cache[word];
  if (v !== undefined && v !== 'loading') { onReady(v); return; }

  if (v === undefined) loadIntoCache(word);

  const poll = setInterval(() => {
    const cur = cache[word];
    if (cur !== undefined && cur !== 'loading') {
      clearInterval(poll);
      onReady(cur);
    }
  }, 80);

  setTimeout(() => {
    clearInterval(poll);
    if (!cache[word] || cache[word] === 'loading') {
      cache[word] = '';
      onReady('');
    }
  }, 8000);
}
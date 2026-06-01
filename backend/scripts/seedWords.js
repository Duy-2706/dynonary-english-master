/**
 * seedWords.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive vocabulary seeding script.
 *
 * Features:
 *   - ~1400 built-in words across 24 topics, A1-B2 CEFR levels
 *   - Fetches phonetic, audio, definition, synonyms, antonyms from Free Dictionary API
 *   - Fetches images from Pixabay API (requires PIXABAY_API_KEY)
 *   - Stores Google TTS fallback audio URL (works without API key)
 *   - Saves to Firestore `words` collection
 *   - Rate limiting: 300ms between API calls
 *   - Retry logic: 3 retries with 1s delay
 *
 * Usage:
 *   cd backend
 *   node scripts/seedWords.js                  # full seed
 *   node scripts/seedWords.js --topic animals  # one topic only
 *   node scripts/seedWords.js --level A1       # one CEFR level only
 *   node scripts/seedWords.js --dry-run        # preview without writing
 *   node scripts/seedWords.js --force          # overwrite existing
 *   node scripts/seedWords.js --skip-image     # don't call Pixabay
 *   node scripts/seedWords.js --skip-audio     # don't call Dictionary API
 *   node scripts/seedWords.js --limit 50       # seed only first N words
 *
 * Environment variables required:
 *   FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL  (Firebase)
 *   PIXABAY_API_KEY  (optional – skip with --skip-image)
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.local.env') });
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const https = require('https');
const { db, COLLECTIONS } = require('../src/configs/firebase.config');
const { WORD_LIST } = require('./data/words.data');

// ─── CLI argument parsing ─────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1] || true;
}

const FILTER_TOPIC = getArg('--topic') || null;
const FILTER_LEVEL = getArg('--level') || null;
const LIMIT        = parseInt(getArg('--limit'), 10) || null;
const DRY_RUN      = args.includes('--dry-run');
const FORCE        = args.includes('--force');
const SKIP_IMAGE   = args.includes('--skip-image');
const SKIP_AUDIO   = args.includes('--skip-audio');

// ─── Configuration ────────────────────────────────────────────────────────────

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '';
const DELAY_MS        = 300;
const RETRY_COUNT     = 3;
const RETRY_DELAY_MS  = 1000;

// ─── Utility helpers ──────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`JSON parse error for ${url}: ${e.message}`));
        }
      });
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out: ${url}`));
    });
    req.on('error', reject);
  });
}

async function withRetry(fn, maxRetries = RETRY_COUNT, retryDelayMs = RETRY_DELAY_MS) {
  let lastErr;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries) await sleep(retryDelayMs);
    }
  }
  throw lastErr;
}

// Google Translate TTS — free, no key, MP3 playable in browser.
function googleTtsUrl(word) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(word)}`;
}

// LoremFlickr — free image service, no key needed.
// Returns a relevant photo URL for any English keyword (320×240, safe content).
function loremFlickrUrl(word) {
  return `https://loremflickr.com/320/240/${encodeURIComponent(word)},education/all`;
}

// ─── API callers ──────────────────────────────────────────────────────────────

async function fetchDictionary(word) {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const data = await withRetry(() => httpsGet(url));
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];
    const phonetics = entry.phonetics || [];

    let phoneticText = entry.phonetic || '';
    let audioUrl = '';
    for (const p of phonetics) {
      if (p.text && !phoneticText) phoneticText = p.text;
      if (p.audio && !audioUrl) audioUrl = p.audio;
    }

    let note = '';
    const synonyms = new Set();
    const antonyms = new Set();
    const examples = [];

    for (const meaning of (entry.meanings || [])) {
      for (const def of (meaning.definitions || [])) {
        if (!note && def.definition) note = def.definition;
        (def.synonyms || []).forEach((s) => synonyms.add(s));
        (def.antonyms || []).forEach((a) => antonyms.add(a));
        if (def.example && examples.length < 3) {
          examples.push({
            word: word.toLowerCase(),
            example: def.example,
            mean: '',
            phonetic: phoneticText,
            picture: '',
          });
        }
      }
      (meaning.synonyms || []).forEach((s) => synonyms.add(s));
      (meaning.antonyms || []).forEach((a) => antonyms.add(a));
    }

    return {
      phonetic: phoneticText,
      audioUrl,
      note,
      synonyms: [...synonyms].slice(0, 10),
      antonyms: [...antonyms].slice(0, 10),
      examples,
    };
  } catch {
    return null;
  }
}

async function fetchPixabay(word) {
  if (!PIXABAY_API_KEY) return loremFlickrUrl(word); // free fallback
  try {
    const url =
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}` +
      `&q=${encodeURIComponent(word)}&image_type=photo` +
      `&per_page=3&safesearch=true&lang=en`;
    const data = await withRetry(() => httpsGet(url));
    const hits = (data && data.hits) || [];
    if (hits.length === 0) return loremFlickrUrl(word);
    return hits[0].webformatURL || hits[0].largeImageURL || loremFlickrUrl(word);
  } catch {
    return loremFlickrUrl(word);
  }
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

async function findExistingWordId(word) {
  const snap = await db
    .collection(COLLECTIONS.WORDS)
    .where('word', '==', word.toLowerCase())
    .limit(1)
    .get();
  if (snap.empty) return null;
  return snap.docs[0].id;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = { total: 0, created: 0, updated: 0, skipped: 0, failed: 0 };

// ─── Per-word processing ──────────────────────────────────────────────────────

async function processWord(entry, idx, total) {
  const wordLower = entry.word.toLowerCase();
  stats.total++;

  let existingId = null;
  if (!DRY_RUN) {
    existingId = await findExistingWordId(wordLower);
    if (existingId && !FORCE) {
      process.stdout.write(`⚠️  [${idx}/${total}] "${wordLower}" already exists – skipping\n`);
      stats.skipped++;
      return;
    }
  }

  let dictData = null;
  if (!SKIP_AUDIO) {
    await sleep(DELAY_MS);
    dictData = await fetchDictionary(wordLower);
  }

  let picture = '';
  if (!SKIP_IMAGE) {
    await sleep(DELAY_MS);
    picture = await fetchPixabay(wordLower); // uses LoremFlickr if no Pixabay key
  }

  // audioUrl falls back to Google TTS so every word is playable.
  const audioUrl =
    (dictData && dictData.audioUrl) || googleTtsUrl(wordLower);

  const doc = {
    word: wordLower,
    type: entry.type,
    mean: entry.mean,
    phonetic: (dictData && dictData.phonetic) || '',
    note: (dictData && dictData.note) || (entry.note || ''),
    picture,
    audioUrl,
    level: entry.level,
    specialty: '',
    isChecked: false,
    topics: entry.topics || [],
    synonyms: (dictData && dictData.synonyms) || [],
    antonyms: (dictData && dictData.antonyms) || [],
    examples: (dictData && dictData.examples) || [],
  };

  if (DRY_RUN) {
    process.stdout.write(
      `✅ [${idx}/${total}] DRY-RUN "${wordLower}" (${entry.level}, ${entry.topics.join(', ')})\n`,
    );
    stats.created++;
    return;
  }

  try {
    if (existingId) {
      await db.collection(COLLECTIONS.WORDS).doc(existingId).update(doc);
      process.stdout.write(`✅ [${idx}/${total}] Updated  "${wordLower}"\n`);
      stats.updated++;
    } else {
      await db.collection(COLLECTIONS.WORDS).add(doc);
      process.stdout.write(`✅ [${idx}/${total}] Created  "${wordLower}"\n`);
      stats.created++;
    }
  } catch (err) {
    process.stderr.write(`❌ [${idx}/${total}] Failed   "${wordLower}": ${err.message}\n`);
    stats.failed++;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(60));
  console.log(' seedWords.js – Dynonary vocabulary seeder');
  console.log('='.repeat(60));
  console.log(`Mode    : ${DRY_RUN ? 'DRY-RUN (no writes)' : 'LIVE'}`);
  console.log(`Force   : ${FORCE}`);
  console.log(`Topic   : ${FILTER_TOPIC || 'all'}`);
  console.log(`Level   : ${FILTER_LEVEL || 'all'}`);
  console.log(`Limit   : ${LIMIT || 'none'}`);
  console.log(`Images  : ${SKIP_IMAGE ? 'skipped' : PIXABAY_API_KEY ? 'Pixabay (HD)' : 'LoremFlickr (free fallback, no key needed)'}`);
  console.log(`Audio   : ${SKIP_AUDIO ? 'skipped (TTS fallback only)' : 'enabled'}`);
  console.log('─'.repeat(60));

  let list = WORD_LIST;

  if (FILTER_TOPIC) {
    list = list.filter((wEntry) => wEntry.topics.includes(FILTER_TOPIC));
    if (list.length === 0) {
      const topics = [...new Set(WORD_LIST.flatMap((wEntry) => wEntry.topics))].sort();
      console.error(`No words found for topic "${FILTER_TOPIC}".`);
      console.error('Available topics: ' + topics.join(', '));
      process.exit(1);
    }
  }

  if (FILTER_LEVEL) {
    list = list.filter((wEntry) => wEntry.level === FILTER_LEVEL);
    if (list.length === 0) {
      console.error(`No words found for level "${FILTER_LEVEL}".`);
      console.error('Available levels: A1, A2, B1, B2');
      process.exit(1);
    }
  }

  if (LIMIT) list = list.slice(0, LIMIT);

  console.log(`Processing ${list.length} word(s) ...\n`);

  for (let i = 0; i < list.length; i++) {
    await processWord(list[i], i + 1, list.length);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('Summary:');
  console.log(`  Total processed : ${stats.total}`);
  console.log(`  Created         : ${stats.created}`);
  console.log(`  Updated         : ${stats.updated}`);
  console.log(`  Skipped         : ${stats.skipped}`);
  console.log(`  Failed          : ${stats.failed}`);
  console.log('='.repeat(60));

  if (!DRY_RUN) await sleep(1000);
  process.exit(stats.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

'use strict';
/**
 * enrichWords.js — populate missing phonetics from FreeDictionary API
 *
 * Usage:
 *   node scripts/enrichWords.js              # fill up to 500 words
 *   node scripts/enrichWords.js --limit 100  # fill first 100
 *   node scripts/enrichWords.js --dry-run    # preview without writing
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.local.env') });
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const https = require('https');
const { db, COLLECTIONS } = require('../src/configs/firebase.config');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = parseInt((args.find(a => a.startsWith('--limit='))?.split('=')[1] ||
  (args.indexOf('--limit') !== -1 ? args[args.indexOf('--limit') + 1] : '500')), 10) || 500;
const DELAY_MS = 400;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchPhonetic(word) {
  return new Promise((resolve) => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`;
    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', d => (data += d));
      res.on('end', () => {
        try {
          const arr = JSON.parse(data);
          if (!Array.isArray(arr) || !arr[0]) return resolve('');
          const entry = arr[0];
          let text = entry.phonetic || '';
          if (!text && entry.phonetics?.length) {
            text = entry.phonetics.find(p => p.text)?.text || '';
          }
          resolve(text);
        } catch {
          resolve('');
        }
      });
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

async function main() {
  const wordsCol = db.collection(COLLECTIONS.WORDS);

  // Fetch words with empty phonetic
  const snap = await wordsCol.where('phonetic', '==', '').limit(LIMIT).get();
  console.log(`Found ${snap.size} words with empty phonetic (limit ${LIMIT})`);
  if (DRY_RUN) console.log('DRY RUN — no writes');

  let updated = 0, skipped = 0;

  for (const doc of snap.docs) {
    const { word } = doc.data();
    const phonetic = await fetchPhonetic(word);

    if (phonetic) {
      console.log(`✓ ${word.padEnd(20)} ${phonetic}`);
      if (!DRY_RUN) await doc.ref.update({ phonetic });
      updated++;
    } else {
      console.log(`  ${word.padEnd(20)} (no phonetic)`);
      skipped++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone — updated: ${updated}, no phonetic found: ${skipped}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

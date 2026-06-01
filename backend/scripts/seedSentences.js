/**
 * seedSentences.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive conversational sentence seeding script.
 *
 * Features:
 *   - 285+ built-in sentences across 17 topic groups, A1-B2 CEFR levels
 *   - Generates Google TTS audio URL for each sentence (no API key needed)
 *   - Links each sentence to a kid-friendly YouTube video for its topic
 *   - Saves to Firestore `sentences` collection
 *
 * Usage:
 *   cd backend
 *   node scripts/seedSentences.js                     # full seed
 *   node scripts/seedSentences.js --topic greetings   # one topic only
 *   node scripts/seedSentences.js --level A1          # one CEFR level only
 *   node scripts/seedSentences.js --dry-run           # preview without writing
 *   node scripts/seedSentences.js --force             # overwrite existing
 *   node scripts/seedSentences.js --limit 50          # seed only first N sentences
 *
 * Environment variables required:
 *   FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.local.env') });
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { db, COLLECTIONS } = require('../src/configs/firebase.config');
const { SENTENCE_LIST, TOPIC_VIDEOS } = require('./data/sentences.data');

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

// ─── Utility helpers ──────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Google Translate TTS — free, no key needed.
 * Returns an MP3 URL playable directly in the browser.
 * Works for full sentences as well as single words.
 */
function googleTtsUrl(text) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
}

/**
 * Return the YouTube video URL for a given topic.
 * Falls back to a generic English-for-kids search if the topic is not mapped.
 */
function getVideoUrl(topics) {
  if (!topics || topics.length === 0) return '';
  const primary = topics[0];
  return TOPIC_VIDEOS[primary] ||
    'https://www.youtube.com/results?search_query=english+for+kids+learning';
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

async function findExistingSentenceId(sentence) {
  const snap = await db
    .collection(COLLECTIONS.SENTENCES)
    .where('sentence', '==', sentence)
    .limit(1)
    .get();
  if (snap.empty) return null;
  return snap.docs[0].id;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = { total: 0, created: 0, updated: 0, skipped: 0, failed: 0 };

// ─── Per-sentence processing ──────────────────────────────────────────────────

async function processSentence(entry, idx, total) {
  const sentenceText = entry.sentence.trim();
  stats.total++;

  let existingId = null;
  if (!DRY_RUN) {
    existingId = await findExistingSentenceId(sentenceText);
    if (existingId && !FORCE) {
      process.stdout.write(`⚠️  [${idx}/${total}] Already exists – skipping: "${sentenceText.slice(0, 50)}"\n`);
      stats.skipped++;
      return;
    }
  }

  const audioUrl = googleTtsUrl(sentenceText);
  const videoUrl = getVideoUrl(entry.topics);

  const doc = {
    sentence:  sentenceText,
    mean:      entry.mean   || '',
    note:      entry.note   || '',
    topics:    entry.topics || [],
    level:     entry.level  || 'A1',
    audioUrl,
    videoUrl,
    isChecked: false,
  };

  if (DRY_RUN) {
    process.stdout.write(
      `✅ [${idx}/${total}] DRY-RUN (${doc.level}, ${doc.topics.join(', ')}) – "${sentenceText.slice(0, 60)}"\n`,
    );
    stats.created++;
    return;
  }

  try {
    if (existingId) {
      await db.collection(COLLECTIONS.SENTENCES).doc(existingId).update(doc);
      process.stdout.write(`✅ [${idx}/${total}] Updated  "${sentenceText.slice(0, 60)}"\n`);
      stats.updated++;
    } else {
      await db.collection(COLLECTIONS.SENTENCES).add(doc);
      process.stdout.write(`✅ [${idx}/${total}] Created  "${sentenceText.slice(0, 60)}"\n`);
      stats.created++;
    }
  } catch (err) {
    process.stderr.write(`❌ [${idx}/${total}] Failed   "${sentenceText.slice(0, 60)}": ${err.message}\n`);
    stats.failed++;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(60));
  console.log(' seedSentences.js – Dynonary conversation sentences seeder');
  console.log('='.repeat(60));
  console.log(`Mode    : ${DRY_RUN ? 'DRY-RUN (no writes)' : 'LIVE'}`);
  console.log(`Force   : ${FORCE}`);
  console.log(`Topic   : ${FILTER_TOPIC || 'all'}`);
  console.log(`Level   : ${FILTER_LEVEL || 'all'}`);
  console.log(`Limit   : ${LIMIT || 'none'}`);
  console.log(`Audio   : Google TTS (always enabled, no key required)`);
  console.log(`Video   : YouTube topic search URLs`);
  console.log('─'.repeat(60));

  let list = SENTENCE_LIST;

  if (FILTER_TOPIC) {
    list = list.filter((entry) => entry.topics.includes(FILTER_TOPIC));
    if (list.length === 0) {
      const topics = [...new Set(SENTENCE_LIST.flatMap((e) => e.topics))].sort();
      console.error(`No sentences found for topic "${FILTER_TOPIC}".`);
      console.error('Available topics: ' + topics.join(', '));
      process.exit(1);
    }
  }

  if (FILTER_LEVEL) {
    list = list.filter((entry) => entry.level === FILTER_LEVEL);
    if (list.length === 0) {
      console.error(`No sentences found for level "${FILTER_LEVEL}".`);
      console.error('Available levels: A1, A2, B1, B2');
      process.exit(1);
    }
  }

  if (LIMIT) list = list.slice(0, LIMIT);

  console.log(`Processing ${list.length} sentence(s) ...\n`);

  for (let i = 0; i < list.length; i++) {
    await processSentence(list[i], i + 1, list.length);
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

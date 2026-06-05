'use strict';
/**
 * clearExpiredImages.js — xóa các Pixabay URL đã hết hạn khỏi Firestore
 *
 * Usage: node scripts/clearExpiredImages.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.local.env') });
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { db, COLLECTIONS } = require('../src/configs/firebase.config');

(async () => {
  const wordsCol = db.collection(COLLECTIONS.WORDS);
  const snap = await wordsCol.get();

  let cleared = 0;
  const batch = db.batch();

  snap.docs.forEach((doc) => {
    const { picture } = doc.data();
    if (picture && picture.includes('pixabay.com/get/')) {
      batch.update(doc.ref, { picture: '' });
      cleared++;
    }
  });

  if (cleared > 0) {
    await batch.commit();
    console.log(`Cleared ${cleared} expired Pixabay URLs.`);
  } else {
    console.log('No expired Pixabay URLs found.');
  }

  process.exit(0);
})();

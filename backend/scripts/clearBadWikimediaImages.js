'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.local.env') });
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { db, COLLECTIONS } = require('../src/configs/firebase.config');

(async () => {
  const snap = await db.collection(COLLECTIONS.WORDS).get();
  let count = 0;
  const batch = db.batch();

  snap.docs.forEach((doc) => {
    const { picture } = doc.data();
    if (picture && (picture.includes('pixabay.com') || picture.includes('640px-'))) {
      batch.update(doc.ref, { picture: '' });
      count++;
    }
  });

  if (count > 0) {
    await batch.commit();
    console.log(`Cleared ${count} bad image URLs.`);
  } else {
    console.log('No bad URLs found.');
  }

  process.exit(0);
})();

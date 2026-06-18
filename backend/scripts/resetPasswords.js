/**
 * One-time migration: reset ALL account passwords to 12345678a
 * Run from backend directory: node scripts/resetPasswords.js
 */
require('dotenv').config();
console.log('PROJECT_ID =', process.env.FIREBASE_PROJECT_ID);
require('dotenv').config({ path: '.local.env', override: false });

const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    }),
  });
}

const db = admin.firestore();

async function run() {
  const NEW_PASSWORD = '12345678a';
  const hash = await bcrypt.hash(NEW_PASSWORD, 10);

  const snap = await db.collection('accounts').get();
  const docs = snap.docs;
  console.log(`Found ${docs.length} accounts. Resetting passwords...`);

  const CHUNK = 499;
  let updated = 0;
  for (let i = 0; i < docs.length; i += CHUNK) {
    const batch = db.batch();
    docs.slice(i, i + CHUNK).forEach((d) => batch.update(d.ref, { password: hash }));
    await batch.commit();
    updated += Math.min(CHUNK, docs.length - i);
    console.log(`  ${updated}/${docs.length} done`);
  }

  console.log(`\nDone! Reset ${updated} accounts to password: ${NEW_PASSWORD}`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

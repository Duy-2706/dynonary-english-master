require('dotenv').config();
require('dotenv').config({ path: '.local.env', override: false });

const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

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
  const EMAIL = 'admin@gmail.com';
  const PASSWORD = '12345678a';
  const NAME = 'Admin';

  // Check if already exists
  const existing = await db.collection('accounts').where('email', '==', EMAIL).limit(1).get();
  if (!existing.empty) {
    console.log('Account admin@gmail.com already exists. Updating password and ensuring admin role...');
    const accountDoc = existing.docs[0];
    const hash = await bcrypt.hash(PASSWORD, 10);
    await accountDoc.ref.update({ password: hash });

    // Find user doc and ensure role = admin
    const userSnap = await db.collection('users').where('accountId', '==', accountDoc.id).limit(1).get();
    if (!userSnap.empty) {
      await userSnap.docs[0].ref.update({ role: 'admin' });
      console.log('Updated: password reset and role set to admin.');
    }
    process.exit(0);
  }

  const hash = await bcrypt.hash(PASSWORD, 10);
  const accountRef = await db.collection('accounts').add({
    email: EMAIL,
    password: hash,
    authType: 'local',
    isVerified: true,
    createdDate: new Date(),
  });

  await db.collection('users').add({
    accountId: accountRef.id,
    name: NAME,
    username: 'adminvKQxk',
    avt: '',
    coin: 0,
    favoriteList: [],
    role: 'admin',
  });

  console.log(`Created admin account: ${EMAIL} / ${PASSWORD}`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
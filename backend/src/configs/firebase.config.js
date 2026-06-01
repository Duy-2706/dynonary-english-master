const admin = require('firebase-admin');

/**
 * Firebase Admin SDK initialization
 * Credentials are loaded from environment variables for security.
 * Set the following env vars in your .env file:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_PRIVATE_KEY_ID
 *   FIREBASE_PRIVATE_KEY
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_CLIENT_ID
 */
if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
      process.env.FIREBASE_CLIENT_EMAIL || '',
    )}`,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Firestore collection references
const COLLECTIONS = {
  ACCOUNTS: 'accounts',
  USERS: 'users',
  VERIFY_CODES: 'verifyCodes',
  WORDS: 'words',
  SENTENCES: 'sentences',
  BLOGS: 'blogs',
  HIGHSCORES: 'highscores',
  COURSES: 'courses',
  CHAPTERS: 'chapters',
  LESSONS: 'lessons',
  ENROLLMENTS: 'enrollments',
  LESSON_PROGRESS: 'lessonProgress',
  CLASSROOMS: 'classrooms',
  GRAMMAR_LESSONS: 'grammarLessons',
  GRAMMAR_PROGRESS: 'grammarProgress',
};

/**
 * Convert a Firestore DocumentSnapshot to a plain object.
 * Adds both `id` (Firestore convention) and `_id` (MongoDB backward-compat alias)
 * so the existing frontend code that uses `item._id` continues to work.
 */
function docToObj(doc) {
  if (!doc || !doc.exists) return null;
  return { _id: doc.id, id: doc.id, ...doc.data() };
}

module.exports = { admin, db, COLLECTIONS, docToObj };

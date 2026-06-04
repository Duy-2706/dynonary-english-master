// set environment variables
require('dotenv').config();
require('dotenv').config({ path: '.local.env', override: false });

// import third-party
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// import local file
const { MAX } = require('./src/constant');
const corsConfig = require('./src/configs/cors.config');
const accountApi = require('./src/apis/account.api');
const wordApi = require('./src/apis/word.api');
const gameApi = require('./src/apis/game.api');
const flashcardApi = require('./src/apis/flashcard.api');
const commonApi = require('./src/apis/common.api');
const sentenceApi = require('./src/apis/sentence.api');
const blogApi = require('./src/apis/blog.api');
const highscoreApi = require('./src/apis/highscore.api');
const passportConfig = require('./src/middlewares/passport.middleware');
const classroomApi = require('./src/apis/classroom.api');
const courseApi = require('./src/apis/course.api');
const grammarApi = require('./src/apis/grammar.api');
const adminApi = require('./src/apis/admin.api');
const statsApi = require('./src/apis/stats.api');

// ================== set port ==================
const app = express();
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 3000);

// ================== setup ==================
app.use(express.static(path.join(__dirname, '/src/build')));

const dev = app.get('env') !== 'production';

if (!dev) {
  app.disable('x-powered-by');
  app.use(morgan('common'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/build', 'index.html'));
  });
} else {
  app.use(morgan('dev'));
}

require('./src/configs/firebase.config');
console.log('Firebase Firestore connected ✓');

const adminService = require('./src/services/admin.service');
adminService.seedGrammarTenses()
  .then((r) => console.log('Grammar seed:', r.message))
  .catch(() => {});

// ================== config ==================
app.use(express.json({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(express.urlencoded({ limit: MAX.SIZE_JSON_REQUEST }));
app.use(cookieParser());
app.options('*', cors(corsConfig));
app.use(cors(corsConfig));

// ================== Listening ... ==================
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} !!`);
});

// ================== Apis ==================
const BASE_URL = '/apis';
app.use(`${BASE_URL}/account`, accountApi);
app.use(`${BASE_URL}/word`, wordApi);
app.use(`${BASE_URL}/games`, gameApi);
app.use(`${BASE_URL}/flashcard`, flashcardApi);
app.use(`${BASE_URL}/common`, commonApi);
app.use(`${BASE_URL}/sentence`, sentenceApi);
app.use(`${BASE_URL}/blog`, blogApi);
app.use(
  `${BASE_URL}/highscore`,
  passportConfig.jwtAuthentication,
  highscoreApi,
);
app.use(
  `${BASE_URL}/classroom`,
  passportConfig.jwtAuthentication,
  classroomApi,
);
app.use(`${BASE_URL}/course`, courseApi);
app.use(`${BASE_URL}/grammar`, grammarApi);
app.use(`${BASE_URL}/admin`, adminApi);
app.use(`${BASE_URL}/stats`, statsApi);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/build', 'index.html'));
});
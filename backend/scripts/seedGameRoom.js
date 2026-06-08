'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.local.env') });
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { db } = require('../src/configs/firebase.config');

const HOST_ID = 'fcic86IHUAOl5aoyHfRg';
const PIN = '888001';

const questions = [
  {
    word: 'tallest',
    mean: 'Mount Everest is the _____ mountain in the world.',
    phonetic: 'superlative của tall',
    picture: '',
    audioUrl: '',
    choices: ['higher', 'more high', 'most high', 'tallest'],
    correct: 'tallest',
  },
  {
    word: 'strangest',
    mean: 'This is the _____ story I have ever heard.',
    phonetic: 'superlative của strange',
    picture: '',
    audioUrl: '',
    choices: ['strangest', 'more strange', 'stranger', 'most strange'],
    correct: 'strangest',
  },
  {
    word: 'so intelligent as',
    mean: 'She is not _____ her sister.',
    phonetic: 'so/as ... as (phủ định)',
    picture: '',
    audioUrl: '',
    choices: ['as intelligent than', 'more intelligent as', 'so intelligent as', 'intelligent as'],
    correct: 'so intelligent as',
  },
  {
    word: 'carefully as',
    mean: 'He drives as _____ his father.',
    phonetic: 'as + adv + as',
    picture: '',
    audioUrl: '',
    choices: ['more carefully than', 'careful as', 'carefully than', 'carefully as'],
    correct: 'carefully as',
  },
  {
    word: 'best',
    mean: 'This is the _____ solution to the problem.',
    phonetic: 'superlative bất quy tắc của good',
    picture: '',
    audioUrl: '',
    choices: ['better', 'best', 'good', 'most better'],
    correct: 'best',
  },
  {
    word: 'the same',
    mean: 'My house is _____ size as yours.',
    phonetic: 'the same ... as',
    picture: '',
    audioUrl: '',
    choices: ['as same', 'same', 'the same', 'similar'],
    correct: 'the same',
  },
  {
    word: 'as soon as',
    mean: 'Call me _____ you arrive.',
    phonetic: 'mệnh đề thời gian',
    picture: '',
    audioUrl: '',
    choices: ['as soon', 'soon than', 'as soon as', 'sooner as'],
    correct: 'as soon as',
  },
  {
    word: 'as rapidly as',
    mean: 'Technology is advancing _____ ever before.',
    phonetic: 'as ... as ever before',
    picture: '',
    audioUrl: '',
    choices: ['as rapidly as', 'more rapidly than', 'as rapidly than', 'rapidly as'],
    correct: 'as rapidly as',
  },
  {
    word: 'more popular than',
    mean: 'Electric cars are becoming _____ traditional ones.',
    phonetic: 'comparative + than',
    picture: '',
    audioUrl: '',
    choices: ['as popular as', 'the most popular than', 'more popular than', 'most popular'],
    correct: 'more popular than',
  },
  {
    word: 'the most modern',
    mean: 'This is _____ museum in the city.',
    phonetic: 'the + superlative',
    picture: '',
    audioUrl: '',
    choices: ['the more modern', 'the most modern', 'modern than', 'most modern'],
    correct: 'the most modern',
  },
  {
    word: 'less convenient than',
    mean: 'Taking the bus is _____ driving in rush hour.',
    phonetic: 'less + adj + than',
    picture: '',
    audioUrl: '',
    choices: ['the least convenient', 'as convenient as', 'less convenient than', 'least convenient as'],
    correct: 'less convenient than',
  },
  {
    word: 'more and more attractive',
    mean: 'The city is becoming _____ every year.',
    phonetic: 'more and more + adj',
    picture: '',
    audioUrl: '',
    choices: ['more attractive', 'attractive and attractive', 'more and most attractive', 'more and more attractive'],
    correct: 'more and more attractive',
  },
  {
    word: 'farther',
    mean: 'Can you move _____ away from the screen?',
    phonetic: 'comparative bất quy tắc của far',
    picture: '',
    audioUrl: '',
    choices: ['farther', 'far', 'farthest', 'more far'],
    correct: 'farther',
  },
  {
    word: 'better',
    mean: 'I feel much _____ today than yesterday.',
    phonetic: 'comparative bất quy tắc của good',
    picture: '',
    audioUrl: '',
    choices: ['good', 'better', 'best', 'more good'],
    correct: 'better',
  },
  {
    word: 'the',
    mean: 'Of all the students, she works _____ hardest.',
    phonetic: 'the + superlative adverb',
    picture: '',
    audioUrl: '',
    choices: ['more', 'much', 'the more', 'the'],
    correct: 'the',
  },
  {
    word: 'earlier',
    mean: 'You should arrive _____ to get a good seat.',
    phonetic: 'comparative của early',
    picture: '',
    audioUrl: '',
    choices: ['early', 'earliest', 'earlier', 'more early'],
    correct: 'earlier',
  },
  {
    word: 'better',
    mean: 'The more you practice, the _____ you become.',
    phonetic: 'the + comparative, the + comparative',
    picture: '',
    audioUrl: '',
    choices: ['better', 'best', 'good', 'well'],
    correct: 'better',
  },
  {
    word: 'the greedier',
    mean: 'The richer he got, _____ he became.',
    phonetic: 'the + comparative, the + comparative',
    picture: '',
    audioUrl: '',
    choices: ['the greedy', 'the greedier', 'more greedier', 'greedier'],
    correct: 'the greedier',
  },
  {
    word: 'as old',
    mean: 'This building is _____ as the one across the street.',
    phonetic: 'as + adj + as',
    picture: '',
    audioUrl: '',
    choices: ['older than', 'as old', 'old than', 'the oldest'],
    correct: 'as old',
  },
  {
    word: 'larger',
    mean: 'Please use the _____ pot to cook more rice.',
    phonetic: 'comparative + noun',
    picture: '',
    audioUrl: '',
    choices: ['large', 'largest', 'more large', 'larger'],
    correct: 'larger',
  },
];

async function seedGameRoom() {
  const now = new Date().toISOString();

  const roomData = {
    createdAt: now,
    currentQuestion: 0,
    gameType: 'teacher-room',
    hostId: HOST_ID,
    pin: PIN,
    players: {
      [HOST_ID]: {
        answered: false,
        avatar: '🦁',
        name: 'Hoàng Duy',
        score: 0,
        streak: 0,
      },
    },
    questionStartAt: null,
    questions,
    status: 'waiting',
  };

  try {
    const col = db.collection('gameRooms');

    const existing = await col.where('pin', '==', PIN).limit(1).get();
    if (!existing.empty) {
      console.log(`PIN ${PIN} đã tồn tại — đang ghi đè...`);
      await col.doc(existing.docs[0].id).set(roomData);
      console.log(`Đã cập nhật gameRooms/${existing.docs[0].id}`);
    } else {
      const ref = await col.add(roomData);
      console.log(`Đã tạo gameRooms/${ref.id}`);
    }

    console.log(`\n  PIN      : ${PIN}`);
    console.log(`  hostId   : ${HOST_ID}`);
    console.log(`  gameType : teacher-room`);
    console.log(`  status   : waiting`);
    console.log(`  Câu hỏi  : ${questions.length}`);
    console.log(`\nXong! Vào game nhập PIN ${PIN} để test.`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err);
    process.exit(1);
  }
}

seedGameRoom();
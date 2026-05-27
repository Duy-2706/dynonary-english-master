require('dotenv').config();
const mongoose = require('mongoose');

const WordModel = require('./src/models/word.model');

const MONGO_URL = process.env.MONGO_URL_LOCAL || process.env.MONGO_URL;

const TOPIC = {
  PLANT: '0',
  LIFE: '1',
  HEALTH: '2',
  FOOD: '3',
  OBJECT: '4',
  ANIMAL: '6',
  SKILL: '7',
  TECHNOLOGY: '9',
  PEOPLE: '10',
  JOB: '11',
  ENTERTAINMENT: '12',
  HOBBY: '13',
  SPORT: '14',
  TRAVEL: '15',
  COUNTRY: '16',
  COLOR: '17',
  BELIEF: '18',
  INTERESTING: '19',
  TOEIC: '20',
  IELTS: '21',
  OTHER: '22',
  NATURE: '23',
  RELATIONSHIP: '24',
  CLOTHES: '25',
  EDUCATION: '26',
};

const SPECIALTY = {
  NONE: '0',
  BIOTECH: '1',
  ACCOUNTING: '2',
  ECONOMICS: '3',
  INTERNATIONAL_TRADE: '4',
  HR: '5',
  IT: '6',
  BUSINESS: '7',
  CHEMICAL: '8',
  BUSINESS_ENGLISH: '9',
  ECOMMERCE: '10',
  FINANCE: '11',
  MARKETING: '12',
  DESIGN: '13',
  FOOD_TECH: '14',
  SOCIOLOGY: '15',
  CULTURE: '16',
  CONSTRUCTION: '17',
  HOTEL: '18',
  ART: '19',
  ENTERTAINMENT: '20',
};

const RULES = [
  {
    topics: [TOPIC.FOOD],
    specialty: SPECIALTY.FOOD_TECH,
    words: [
      'food', 'rice', 'bread', 'meat', 'fish', 'chicken', 'egg', 'milk',
      'coffee', 'tea', 'water', 'juice', 'apple', 'banana', 'orange',
      'tomato', 'potato', 'carrot', 'onion', 'soup', 'salad', 'sandwich',
      'cake', 'chocolate', 'butter', 'cheese', 'salt', 'sugar', 'pepper',
      'breakfast', 'lunch', 'dinner', 'meal', 'restaurant', 'menu', 'cook',
      'cooking', 'kitchen', 'delicious', 'drink', 'beer', 'wine',
    ],
  },
  {
    topics: [TOPIC.EDUCATION],
    specialty: SPECIALTY.NONE,
    words: [
      'school', 'teacher', 'student', 'class', 'classroom', 'lesson',
      'homework', 'exam', 'test', 'study', 'learn', 'book', 'pen', 'pencil',
      'paper', 'dictionary', 'library', 'college', 'university', 'subject',
      'science', 'history', 'geography', 'course', 'answer', 'question',
      'sentence', 'paragraph', 'word', 'language', 'grammar', 'read',
      'write', 'listen', 'speak', 'practice', 'skill',
    ],
  },
  {
    topics: [TOPIC.TRAVEL],
    specialty: SPECIALTY.HOTEL,
    words: [
      'travel', 'trip', 'journey', 'airport', 'flight', 'plane', 'train',
      'bus', 'taxi', 'car', 'bike', 'bicycle', 'boat', 'hotel', 'passport',
      'ticket', 'tourist', 'visitor', 'vacation', 'holiday', 'beach',
      'mountain', 'island', 'city', 'town', 'village', 'road', 'street',
      'station', 'traffic', 'map', 'arrive', 'leave', 'visit',
    ],
  },
  {
    topics: [TOPIC.HEALTH],
    specialty: SPECIALTY.BIOTECH,
    words: [
      'health', 'doctor', 'nurse', 'hospital', 'sick', 'diet', 'body',
      'head', 'face', 'eye', 'ear', 'nose', 'mouth', 'tooth', 'hand',
      'arm', 'leg', 'foot', 'heart', 'tired', 'hungry', 'thirsty',
      'medicine', 'pain', 'safe', 'dangerous', 'wash', 'clean',
    ],
  },
  {
    topics: [TOPIC.RELATIONSHIP],
    specialty: SPECIALTY.SOCIOLOGY,
    words: [
      'family', 'father', 'mother', 'parent', 'brother', 'sister', 'son',
      'daughter', 'grandfather', 'grandmother', 'husband', 'wife', 'uncle',
      'aunt', 'cousin', 'friend', 'neighbor', 'partner', 'girlfriend',
      'boyfriend', 'married', 'love',
    ],
  },
  {
    topics: [TOPIC.ANIMAL],
    specialty: SPECIALTY.NONE,
    words: [
      'animal', 'dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig',
      'chicken', 'lion', 'snake', 'mouse',
    ],
  },
  {
    topics: [TOPIC.TECHNOLOGY],
    specialty: SPECIALTY.IT,
    words: [
      'computer', 'phone', 'telephone', 'camera', 'internet', 'website',
      'email', 'message', 'video', 'television', 'radio', 'machine',
      'mouse', 'keyboard', 'online', 'program', 'programme',
    ],
  },
  {
    topics: [TOPIC.JOB],
    specialty: SPECIALTY.BUSINESS,
    words: [
      'work', 'worker', 'job', 'career', 'company', 'business', 'office',
      'meeting', 'boss', 'customer', 'project', 'report', 'interview',
      'desk', 'manager', 'team', 'member', 'plan',
    ],
  },
  {
    topics: [TOPIC.SPORT],
    specialty: SPECIALTY.NONE,
    words: [
      'sport', 'football', 'basketball', 'tennis', 'swim', 'run', 'gym',
      'player', 'match', 'ball', 'game', 'ride', 'climb',
    ],
  },
  {
    topics: [TOPIC.ENTERTAINMENT],
    specialty: SPECIALTY.ENTERTAINMENT,
    words: [
      'movie', 'film', 'cinema', 'theater', 'concert', 'music', 'song',
      'party', 'dance', 'sing', 'singer', 'guitar', 'piano', 'video',
      'fun', 'funny', 'enjoy',
    ],
  },
  {
    topics: [TOPIC.COLOR],
    specialty: SPECIALTY.DESIGN,
    words: [
      'black', 'white', 'red', 'blue', 'green', 'yellow', 'brown',
      'grey', 'pink', 'purple', 'orange', 'color',
    ],
  },
  {
    topics: [TOPIC.CLOTHES],
    specialty: SPECIALTY.DESIGN,
    words: [
      'clothes', 'shirt', 'skirt', 'dress', 'coat', 'jacket', 'sweater',
      'jeans', 'trousers', 'shoe', 'boot', 'hat', 'wear',
    ],
  },
  {
    topics: [TOPIC.NATURE],
    specialty: SPECIALTY.NONE,
    words: [
      'nature', 'sea', 'beach', 'mountain', 'river', 'rain', 'snow',
      'sun', 'air', 'weather', 'cloudy', 'hot', 'cold', 'warm',
      'spring', 'summer', 'autumn', 'winter', 'tree', 'flower', 'plant',
      'garden', 'farm', 'land',
    ],
  },
  {
    topics: [TOPIC.PEOPLE],
    specialty: SPECIALTY.SOCIOLOGY,
    words: [
      'man', 'woman', 'boy', 'girl', 'person', 'people', 'adult',
      'teenager', 'baby', 'child', 'body', 'face', 'hair',
    ],
  },
  {
    topics: [TOPIC.COUNTRY],
    specialty: SPECIALTY.CULTURE,
    words: [
      'country', 'world', 'north', 'south', 'east', 'west', 'culture',
      'flag', 'local', 'village', 'city', 'town',
    ],
  },
  {
    topics: [TOPIC.OBJECT],
    specialty: SPECIALTY.NONE,
    words: [
      'bag', 'box', 'bottle', 'cup', 'glass', 'table', 'chair', 'bed',
      'door', 'window', 'wall', 'floor', 'room', 'house', 'home',
      'apartment', 'flat', 'key', 'card', 'clock', 'watch',
    ],
  },
  {
    topics: [TOPIC.HOBBY],
    specialty: SPECIALTY.NONE,
    words: [
      'hobby', 'paint', 'painting', 'draw', 'art', 'artist', 'photo',
      'picture', 'read', 'book', 'music', 'sport', 'travel', 'cook',
      'garden',
    ],
  },
  {
    topics: [TOPIC.LIFE],
    specialty: SPECIALTY.NONE,
    words: [
      'life', 'daily', 'routine', 'morning', 'afternoon', 'evening',
      'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year',
      'time', 'day', 'home', 'family', 'money', 'buy', 'shop', 'shopping',
      'market', 'supermarket',
    ],
  },
  {
    topics: [TOPIC.TOEIC],
    specialty: SPECIALTY.BUSINESS_ENGLISH,
    words: [
      'business', 'meeting', 'office', 'company', 'customer', 'manager',
      'interview', 'report', 'email', 'schedule', 'appointment', 'invoice',
      'order', 'product', 'service', 'price', 'cost', 'pay', 'bank',
      'finance', 'account', 'market',
    ],
  },
  {
    topics: [TOPIC.IELTS],
    specialty: SPECIALTY.NONE,
    words: [
      'environment', 'education', 'technology', 'society', 'culture',
      'health', 'government', 'population', 'development', 'research',
      'economic', 'global', 'natural', 'problem', 'solution', 'opinion',
      'advantage', 'disadvantage',
    ],
  },
];

function uniqueArray(arr) {
  return [...new Set(arr)];
}

function matchRules(word) {
  const cleanWord = String(word || '').toLowerCase().trim();
  let topics = [];
  let specialties = [];

  for (const rule of RULES) {
    if (rule.words.includes(cleanWord)) {
      topics = topics.concat(rule.topics);
      specialties.push(rule.specialty);
    }
  }

  return {
    topics: uniqueArray(topics),
    specialty: specialties.find((s) => s && s !== SPECIALTY.NONE) || SPECIALTY.NONE,
  };
}

function fallbackTopicsByType(type) {
  if (type === 'v') return [TOPIC.SKILL];
  if (type === 'adj') return [TOPIC.INTERESTING];
  if (type === 'adv') return [TOPIC.SKILL];
  if (['pre', 'con', 'pro', 'det'].includes(type)) return [TOPIC.OTHER];
  if (type === 'n') return [TOPIC.OBJECT];
  return [TOPIC.OTHER];
}

function fallbackSpecialtyByTopic(topics) {
  if (topics.includes(TOPIC.TECHNOLOGY)) return SPECIALTY.IT;
  if (topics.includes(TOPIC.JOB)) return SPECIALTY.BUSINESS;
  if (topics.includes(TOPIC.FOOD)) return SPECIALTY.FOOD_TECH;
  if (topics.includes(TOPIC.ENTERTAINMENT)) return SPECIALTY.ENTERTAINMENT;
  if (topics.includes(TOPIC.TRAVEL)) return SPECIALTY.HOTEL;
  if (topics.includes(TOPIC.COLOR) || topics.includes(TOPIC.CLOTHES)) {
    return SPECIALTY.DESIGN;
  }
  return SPECIALTY.NONE;
}

function normalizeLevel(level) {
  const allowed = ['0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return allowed.includes(level) ? level : '0';
}

function normalizeType(type) {
  const allowed = ['', 'n', 'adj', 'adv', 'v', 'con', 'pre', 'pro', 'det'];
  return allowed.includes(type) ? type : '';
}

async function main() {
  if (!MONGO_URL) {
    throw new Error('Missing MONGO_URL_LOCAL or MONGO_URL');
  }

  await mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  console.log('MongoDB connected');

  const words = await WordModel.find({}).select('word type level topics specialty');

  let updated = 0;
  let unchanged = 0;
  const topicCount = {};
  const specialtyCount = {};

  for (const item of words) {
    const old = {
      type: item.type,
      level: item.level,
      topics: item.topics || [],
      specialty: item.specialty,
    };

    const fixedType = normalizeType(item.type);
    const fixedLevel = normalizeLevel(item.level);

    const matched = matchRules(item.word);

    let newTopics = matched.topics.length > 0 ? matched.topics : fallbackTopicsByType(fixedType);
    newTopics = uniqueArray(newTopics).sort();

    let newSpecialty = matched.specialty || fallbackSpecialtyByTopic(newTopics);

    item.type = fixedType;
    item.level = fixedLevel;
    item.topics = newTopics;
    item.specialty = newSpecialty;

    newTopics.forEach((t) => {
      topicCount[t] = (topicCount[t] || 0) + 1;
    });
    specialtyCount[newSpecialty] = (specialtyCount[newSpecialty] || 0) + 1;

    const changed =
      old.type !== item.type ||
      old.level !== item.level ||
      old.specialty !== item.specialty ||
      JSON.stringify([...old.topics].sort()) !== JSON.stringify(newTopics);

    if (!changed) {
      unchanged++;
      continue;
    }

    await item.save();
    updated++;

    if (updated % 100 === 0) {
      console.log(`Updated ${updated} words...`);
    }
  }

  console.log('======================');
  console.log(`Updated: ${updated}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log('Topic count:', topicCount);
  console.log('Specialty count:', specialtyCount);
  console.log('DONE');

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
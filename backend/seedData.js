require('dotenv').config();
const mongoose = require('mongoose');

const WordModel = require('./src/models/word.model');
const SentenceModel = require('./src/models/sentence.model');

const MONGO_URL = process.env.MONGO_URL_LOCAL || process.env.MONGO_URL;

const WORDS = [
  'hello',
  'goodbye',
  'thank',
  'sorry',
  'learn',
  'study',
  'school',
  'teacher',
  'student',
  'book',
  'family',
  'friend',
  'food',
  'water',
  'happy',
  'sad',
  'beautiful',
  'important',
  'easy',
  'difficult',
  'listen',
  'speak',
  'read',
  'write',
  'question',
  'answer',
  'morning',
  'evening',
  'today',
  'tomorrow',
  'house',
  'room',
  'mother',
  'father',
  'child',
  'money',
  'time',
  'work',
  'play',
  'game',
];

const SENTENCES = [
  {
    sentence: 'How are you?',
    mean: 'Bạn khỏe không?',
    note: 'Câu chào hỏi thông dụng',
    topics: ['greeting'],
    isChecked: true,
  },
  {
    sentence: 'Nice to meet you.',
    mean: 'Rất vui được gặp bạn.',
    note: 'Dùng khi gặp ai đó lần đầu',
    topics: ['greeting'],
    isChecked: true,
  },
  {
    sentence: 'Thank you very much.',
    mean: 'Cảm ơn bạn rất nhiều.',
    note: 'Câu cảm ơn thông dụng',
    topics: ['communication'],
    isChecked: true,
  },
  {
    sentence: 'I am learning English.',
    mean: 'Tôi đang học tiếng Anh.',
    note: 'Câu học tập cơ bản',
    topics: ['study'],
    isChecked: true,
  },
  {
    sentence: 'Could you help me?',
    mean: 'Bạn có thể giúp tôi không?',
    note: 'Dùng khi cần nhờ giúp đỡ',
    topics: ['communication'],
    isChecked: true,
  },
  {
    sentence: 'What is your name?',
    mean: 'Bạn tên là gì?',
    note: 'Câu hỏi thông tin cá nhân',
    topics: ['greeting'],
    isChecked: true,
  },
  {
    sentence: 'Where are you from?',
    mean: 'Bạn đến từ đâu?',
    note: 'Câu hỏi quê quán',
    topics: ['communication'],
    isChecked: true,
  },
  {
    sentence: 'I do not understand.',
    mean: 'Tôi không hiểu.',
    note: 'Dùng khi chưa hiểu nội dung',
    topics: ['study'],
    isChecked: true,
  },
  {
    sentence: 'Please say that again.',
    mean: 'Vui lòng nói lại điều đó.',
    note: 'Dùng khi muốn người khác nhắc lại',
    topics: ['communication'],
    isChecked: true,
  },
  {
    sentence: 'Have a nice day.',
    mean: 'Chúc bạn một ngày tốt lành.',
    note: 'Câu chúc thông dụng',
    topics: ['greeting'],
    isChecked: true,
  },
];

const PICTURE_BY_WORD = {
  hello: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
  goodbye: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
  thank: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
  sorry: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800',
  learn: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800',
  study: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
  school: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
  teacher: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
  student: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
  book: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
  friend: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  water: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800',
  happy: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
  sad: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800',
  beautiful: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
  important: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
  easy: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  difficult: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
};

function mapPartOfSpeech(partOfSpeech) {
  const map = {
    noun: 'n',
    verb: 'v',
    adjective: 'adj',
    adverb: 'adv',
    conjunction: 'con',
    preposition: 'pre',
    pronoun: 'pro',
    determiner: 'det',
  };

  return map[partOfSpeech] || '';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Request failed: ${url}`);
  }

  return res.json();
}

async function translateToVietnamese(text) {
  try {
    const shortText = text.slice(0, 450);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      shortText,
    )}&langpair=en|vi`;

    const data = await fetchJson(url);
    await sleep(300);

    return data?.responseData?.translatedText || text;
  } catch (error) {
    console.log(`Translate failed: ${text}`);
    return text;
  }
}

async function getSynonyms(word) {
  try {
    const url = `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(
      word,
    )}&max=5`;

    const data = await fetchJson(url);
    await sleep(200);

    return data.map((item) => item.word).filter(Boolean);
  } catch (error) {
    return [];
  }
}

async function buildWordDocument(word) {
  const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
    word,
  )}`;

  const data = await fetchJson(dictionaryUrl);
  const first = data[0];

  const phonetic =
    first?.phonetic ||
    first?.phonetics?.find((item) => item.text)?.text ||
    '';

  const meaning = first?.meanings?.[0];
  const definition = meaning?.definitions?.[0];

  const englishMean = definition?.definition || word;
  const vietnameseMean = await translateToVietnamese(englishMean);

  const examples = [];

  if (definition?.example) {
    examples.push(definition.example);
  }

  const synonymsFromDictionary = definition?.synonyms || [];
  const antonymsFromDictionary = definition?.antonyms || [];
  const synonymsFromDatamuse = await getSynonyms(word);

  return {
    word,
    mean: vietnameseMean.slice(0, 100),
    type: mapPartOfSpeech(meaning?.partOfSpeech),
    level: 'A1',
    phonetic,
    examples,
    picture:
      PICTURE_BY_WORD[word] ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    specialty: '0',
    topics: ['0'],
    synonyms: [
      ...new Set([...synonymsFromDictionary, ...synonymsFromDatamuse]),
    ].slice(0, 10),
    antonyms: antonymsFromDictionary.slice(0, 10),
    note: englishMean.slice(0, 150),
    isChecked: true,
  };
}

async function seedWords() {
  for (const word of WORDS) {
    const existed = await WordModel.findOne({ word });

    if (existed) {
      console.log(`Skipped existing word: ${word}`);
      continue;
    }

    try {
      const doc = await buildWordDocument(word);
      await WordModel.create(doc);
      console.log(`Inserted word: ${word}`);
      await sleep(300);
    } catch (error) {
      console.log(`Failed word: ${word}`);
      console.log(error.message);
    }
  }
}

async function seedSentences() {
  for (const sentence of SENTENCES) {
    const existed = await SentenceModel.findOne({
      sentence: sentence.sentence,
    });

    if (existed) {
      console.log(`Skipped existing sentence: ${sentence.sentence}`);
      continue;
    }

    await SentenceModel.create(sentence);
    console.log(`Inserted sentence: ${sentence.sentence}`);
  }
}

async function main() {
  if (!MONGO_URL) {
    throw new Error('Missing MONGO_URL_LOCAL or MONGO_URL in .env');
  }

  await mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  console.log('MongoDB connected');

  await seedWords();
  await seedSentences();

  console.log('Seed completed');
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
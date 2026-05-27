require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const WordModel = require('./src/models/word.model');

const MONGO_URL =
  process.env.MONGO_URL_LOCAL || process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log('MongoDB connected');

    const raw = fs.readFileSync(
      './data/oxford3000_extracted.json',
      'utf-8',
    );

    const words = JSON.parse(raw);

    let inserted = 0;
    let skipped = 0;

    for (const item of words) {
      try {
        const existed = await WordModel.findOne({
          word: item.word,
        });

        if (existed) {
          skipped++;
          continue;
        }

        await WordModel.create({
          word: item.word,
          mean: item.mean || item.word,
          type: item.type || '',
          level: item.level || 'A1',
          phonetic: item.phonetic || '',
          examples: item.examples || [],
          picture:
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
          specialty: '0',
          topics: ['0'],
          synonyms: [],
          antonyms: [],
          note: '',
          isChecked: true,
        });

        inserted++;

        if (inserted % 100 === 0) {
          console.log(`Inserted ${inserted} words...`);
        }
      } catch (err) {
        console.log('Skip error:', item.word);
      }
    }

    console.log('======================');
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped: ${skipped}`);
    console.log('DONE');

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

main();
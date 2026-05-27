require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const SentenceModel = require('./src/models/sentence.model');

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
      './data/extra_sentences_1000.json',
      'utf8',
    );

    const list = JSON.parse(raw);

    let inserted = 0;
    let skipped = 0;

    for (const item of list) {
      try {
        const existed = await SentenceModel.findOne({
          sentence: item.sentence,
        });

        // bỏ qua nếu đã tồn tại
        if (existed) {
          skipped++;
          continue;
        }

        await SentenceModel.create({
          sentence: item.sentence,
          mean: item.mean,
          note: '',
          topics: ['communication'],
          isChecked: true,
        });

        inserted++;

        if (inserted % 50 === 0) {
          console.log(`Inserted ${inserted} sentences...`);
        }
      } catch (err) {
        console.log('Skip error:', item.sentence);
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
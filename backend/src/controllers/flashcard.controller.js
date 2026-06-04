const {
  getWordPack: serviceGetWordPack,
} = require('../services/common.service');
const { fetchImageForWord } = require('../services/imageSearch.service');
const { db, COLLECTIONS } = require('../configs/firebase.config');

const wordsCol = db.collection(COLLECTIONS.WORDS);

/**
 * For words missing a picture: fetch from Pixabay and persist back to Firestore.
 * Runs fire-and-forget so it never delays the API response.
 */
async function enrichMissingImages(words) {
  const lacking = words.filter((w) => (!w.picture || w.picture === '') && w._id);
  for (const w of lacking) {
    try {
      const imgUrl = await fetchImageForWord(w.word);
      if (imgUrl) {
        await wordsCol.doc(w._id).update({ picture: imgUrl });
        w.picture = imgUrl;
      }
    } catch (_) {}
  }
}

exports.getWordPack = async (req, res, next) => {
  try {
    const { page, perPage, packInfo } = req.query;
    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;

    // Fetch extra to compensate for words without pictures
    const fetchLimit = perPageInt * 4;
    const all = await serviceGetWordPack(
      JSON.parse(packInfo),
      skip,
      fetchLimit,
      '_id type word mean level phonetic examples picture',
      null,
      null,
    );

    // Prefer words with pictures; fall back to all if not enough
    const withPic = all.filter((w) => w.picture && w.picture !== '');
    const packList = withPic.length >= perPageInt
      ? withPic.slice(0, perPageInt)
      : all.slice(0, perPageInt);

    // Fire-and-forget: save images to Firestore for future requests
    enrichMissingImages(packList).catch(() => {});

    return res.status(200).json({ packList });
  } catch (error) {
    console.error('GET WORD PACK ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

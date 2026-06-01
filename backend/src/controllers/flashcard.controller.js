const {
  getWordPack: serviceGetWordPack,
} = require('../services/common.service');

exports.getWordPack = async (req, res, next) => {
  try {
    const { page, perPage, packInfo } = req.query;
    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;

    // Fetch more to compensate for words without pictures (Firestore doesn't
    // support $ne / $and operators, so we filter in-memory instead)
    const fetchLimit = perPageInt * 4;
    const all = await serviceGetWordPack(
      JSON.parse(packInfo),
      skip,
      fetchLimit,
      '-_id type word mean level phonetic examples picture',
      null,
      null,
    );

    // Prefer words with pictures; fall back to words without if needed
    const withPic = all.filter((w) => w.picture && w.picture !== '');
    const packList = withPic.length >= perPageInt
      ? withPic.slice(0, perPageInt)
      : all.slice(0, perPageInt);

    return res.status(200).json({ packList });
  } catch (error) {
    console.error('GET WORD PACK ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};
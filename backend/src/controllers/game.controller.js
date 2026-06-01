const { MAX } = require('../constant');
const { randomWordQuestionPack } = require('../helper/game.helper');
const { getWordPack } = require('../services/common.service');
const gameService = require('../services/game.service');

// ======== CORRECT WORD GAME ========
exports.getWordPackCWG = async (req, res, next) => {
  try {
    let { nQuestion = 50, ...packInfo } = req.query;

    nQuestion = parseInt(nQuestion);
    if (nQuestion > MAX.LEN_WORD_PACK) nQuestion = MAX.LEN_WORD_PACK;

    const packages = await getWordPack(
      packInfo,
      0,
      1500,
      '-_id word mean phonetic synonyms',
    );

    const packLen = packages.length > nQuestion ? nQuestion : packages.length;

    if (packLen < 4) {
      return res.status(200).json({ wordPack: [] });
    }
    const wordPack = randomWordQuestionPack(packages, packLen);
    return res.status(200).json({ wordPack });
  } catch (error) {
    console.error('GET WORD PACK CWG ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

// ======== WORD MATCH GAME ========
exports.getWordPackWMG = async (req, res, next) => {
  try {
    let { nQuestion = 50, ...packInfo } = req.query;
    nQuestion = parseInt(nQuestion);
    if (nQuestion > MAX.LEN_WORD_PACK) nQuestion = MAX.LEN_WORD_PACK;

    const seedList = await getWordPack(packInfo, 0, 1500, '-_id word mean');
    if (seedList) {
      return res.status(200).json({
        wordPack: seedList.sort((_) => Math.random() - 0.5).slice(0, nQuestion),
      });
    }

    return res.status(200).json({ wordPack: [] });
  } catch (error) {
    console.error('GET WORD PACK WMG ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

// ======== FAST GAME ========
exports.getWordPackFS = async (req, res, next) => {
  try {
    const { topics, type, level, specialty } = req.query;

    // parse topics từ JSON string
    let topicList = [];
    try {
      topicList = topics ? JSON.parse(topics) : [];
    } catch {
      topicList = [];
    }

    const packInfo = {
      type: type || '-1',
      level: level || '-1',
      specialty: specialty || '-1',
      topics: topicList,
    };

    const packages = await getWordPack(
      packInfo,
      0,
      1500,
      '-_id word picture',
    );

    const nQuestion = 100;
    const wordPack = packages
      .sort(() => Math.random() - 0.5)
      .slice(0, nQuestion);

    return res.status(200).json({ wordPack });
  } catch (error) {
    console.error('GET WORD PACK FAST GAME ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

// ======== MULTIPLAYER GAME ROOMS ========

exports.createRoom = async (req, res) => {
  try {
    const { hostId, hostName, gameType, wordPack } = req.body;
    const room = await gameService.createRoom({ hostId, hostName, gameType, wordPack });
    return res.status(200).json({ room });
  } catch (error) {
    console.error('CREATE ROOM ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { pin, userId, userName } = req.body;
    const room = await gameService.joinRoom(pin, userId, userName);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    return res.status(200).json({ room });
  } catch (error) {
    if (error.message === 'Room not found or already started') {
      return res.status(404).json({ message: 'Không tìm thấy phòng hoặc phòng đã bắt đầu' });
    }
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const { pin } = req.params;
    const room = await gameService.getRoom(pin);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    return res.status(200).json({ room });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.startRoom = async (req, res) => {
  try {
    const { roomId, hostId } = req.body;
    await gameService.startRoom(roomId, hostId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { pin, userId, questionIndex, answer, timeMs } = req.body;
    const result = await gameService.submitAnswer(pin, userId, questionIndex, answer, timeMs);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.nextQuestion = async (req, res) => {
  try {
    const { roomId, hostId } = req.body;
    const result = await gameService.nextQuestion(roomId, hostId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};
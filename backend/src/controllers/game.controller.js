const { MAX } = require('../constant');
const { randomWordQuestionPack } = require('../helper/game.helper');
const { getWordPack } = require('../services/common.service');
const gameService = require('../services/game.service');
const teacherRoomService = require('../services/teacherRoom.service');
const gameProgressService = require('../services/gameProgress.service');
const { updateUserCoin } = require('../services/account.service');

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
    console.error('JOIN ROOM ERROR: ', error);
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
    console.error('GET ROOM ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.startRoom = async (req, res) => {
  try {
    const { roomId, hostId } = req.body;
    await gameService.startRoom(roomId, hostId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('START ROOM ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { pin, userId, questionIndex, answer, timeMs } = req.body;
    const result = await gameService.submitAnswer(pin, userId, questionIndex, answer, timeMs);
    return res.status(200).json(result);
  } catch (error) {
    console.error('SUBMIT ANSWER ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.nextQuestion = async (req, res) => {
  try {
    const { roomId, hostId } = req.body;
    const result = await gameService.nextQuestion(roomId, hostId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('NEXT QUESTION ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

// ======== TEACHER ROOM MANAGEMENT ========

exports.createTeacherRoom = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Cần nhập tên phòng' });
    const room = await teacherRoomService.createRoom({
      teacherAccountId: req.user.accountId,
      teacherName: req.user.name || req.user.username,
      title,
      description,
    });
    return res.status(201).json({ room });
  } catch (error) {
    console.error('CREATE TEACHER ROOM ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getTeacherRooms = async (req, res) => {
  try {
    const rooms = await teacherRoomService.getTeacherRooms(req.user.accountId);
    return res.status(200).json({ rooms });
  } catch (error) {
    console.error('GET TEACHER ROOMS ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getTeacherRoom = async (req, res) => {
  try {
    const room = await teacherRoomService.getRoom(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    // allow owner OR any authenticated user to view
    if (room.teacherAccountId !== req.user?.accountId) {
      // strip sensitive info for non-owners
      const { teacherAccountId, ...publicRoom } = room;
      return res.status(200).json({ room: publicRoom });
    }
    return res.status(200).json({ room });
  } catch (error) {
    console.error('GET TEACHER ROOM ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.updateTeacherRoom = async (req, res) => {
  try {
    const { title, description } = req.body;
    const room = await teacherRoomService.updateRoom(req.params.roomId, req.user.accountId, { title, description });
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng hoặc không có quyền' });
    return res.status(200).json({ room });
  } catch (error) {
    console.error('UPDATE TEACHER ROOM ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.deleteTeacherRoom = async (req, res) => {
  try {
    const ok = await teacherRoomService.deleteRoom(req.params.roomId, req.user.accountId);
    if (!ok) return res.status(404).json({ message: 'Không tìm thấy phòng hoặc không có quyền' });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('DELETE TEACHER ROOM ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const room = await teacherRoomService.addQuestion(req.params.roomId, req.user.accountId, req.body);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng hoặc không có quyền' });
    return res.status(200).json({ room });
  } catch (error) {
    console.error('ADD QUESTION ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const room = await teacherRoomService.updateQuestion(
      req.params.roomId, req.user.accountId, req.params.questionId, req.body
    );
    if (!room) return res.status(404).json({ message: 'Không tìm thấy câu hỏi hoặc không có quyền' });
    return res.status(200).json({ room });
  } catch (error) {
    console.error('UPDATE QUESTION ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const room = await teacherRoomService.deleteQuestion(
      req.params.roomId, req.user.accountId, req.params.questionId
    );
    if (!room) return res.status(404).json({ message: 'Không tìm thấy câu hỏi hoặc không có quyền' });
    return res.status(200).json({ room });
  } catch (error) {
    console.error('DELETE QUESTION ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getRoomByCode = async (req, res) => {
  try {
    const room = await teacherRoomService.getRoomByCode(req.params.roomCode);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng với mã này' });
    // return public info only
    const { teacherAccountId, ...publicRoom } = room;
    return res.status(200).json({ room: publicRoom });
  } catch (error) {
    console.error('GET ROOM BY CODE ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

// Start a live multiplayer session from a teacher room
exports.startLiveSession = async (req, res) => {
  try {
    const room = await teacherRoomService.getRoom(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    if (room.teacherAccountId !== req.user.accountId) {
      return res.status(403).json({ message: 'Không có quyền' });
    }
    if (!room.questions || room.questions.length === 0) {
      return res.status(400).json({ message: 'Phòng chưa có câu hỏi nào' });
    }

    if (room.activeLiveSession) {
      const existingGameRoom = await gameService.getRoomById(room.activeLiveSession.gameRoomId);
      if (existingGameRoom && existingGameRoom.status !== 'ended') {
        return res.status(200).json({
          room: existingGameRoom,
          pin: room.activeLiveSession.pin,
          existing: true,
        });
      }
      // Stale session — clear it and create new
      await teacherRoomService.clearLiveSession(req.params.roomId, req.user.accountId);
    }

    // Build wordPack-compatible structure from teacher questions
    const wordPack = room.questions.map((q) => ({
      word: q.answer || '',
      mean: q.question || '',
      phonetic: q.hint || '',
      picture: '',
      audioUrl: '',
      choices: q.choices || [],
      correct: q.answer || '',
    }));

    const hostId = req.user.accountId;
    const hostName = req.user.name || req.user.username;

     const liveRoom = await gameService.createRoom({ hostId, hostName, gameType: 'teacher-room', wordPack });

    // Save session so repeat clicks return the same PIN
    await teacherRoomService.saveLiveSession(req.params.roomId, req.user.accountId, liveRoom.pin, liveRoom.id);

    // Fetch the full room data so frontend gets players, questions, etc.
    const fullRoom = await gameService.getRoomById(liveRoom.id);

    return res.status(200).json({ room: fullRoom || liveRoom, pin: liveRoom.pin, existing: false });
  } catch (error) {
    console.error('START LIVE SESSION ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.cancelLiveSession = async (req, res) => {
  try {
    const room = await teacherRoomService.getRoom(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    if (room.teacherAccountId !== req.user.accountId) {
      return res.status(403).json({ message: 'Không có quyền' });
    }
    const result = await teacherRoomService.clearLiveSession(req.params.roomId, req.user.accountId);
    if (result?.gameRoomId) {
      await gameService.endRoom(result.gameRoomId);
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('CANCEL LIVE SESSION ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

// ======== GAME PROGRESS (solo practice) ========

exports.startOrResumeProgress = async (req, res) => {
  try {
    const { roomCode, totalQuestions } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Cần đăng nhập để lưu tiến độ' });
    const result = await gameProgressService.startOrResumeGameSession(
      req.user.accountId, roomCode, totalQuestions
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error('START/RESUME PROGRESS ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const session = await gameProgressService.updateGameProgress(req.params.sessionId, req.body);
    if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên' });
    return res.status(200).json({ session });
  } catch (error) {
    console.error('UPDATE PROGRESS ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.completeProgress = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Cần đăng nhập' });
    const result = await gameProgressService.completeGameSession(req.params.sessionId);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy phiên' });

    // Award coins
    if (result.coins > 0 && req.user.username) {
      const newCoin = (req.user.coin || 0) + result.coins;
      await updateUserCoin(newCoin, req.user.username);
    }

    return res.status(200).json({ session: result.session, coinsAwarded: result.coins });
  } catch (error) {
    console.error('COMPLETE PROGRESS ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getGameAttempts = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Cần đăng nhập' });
    const attempts = await gameProgressService.getGameAttempts(req.user.accountId, req.params.roomCode);
    return res.status(200).json({ attempts });
  } catch (error) {
    console.error('GET GAME ATTEMPTS ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

// ======== FLASHCARD PROGRESS ========

exports.startOrResumeFlashcard = async (req, res) => {
  try {
    const { sessionKey, totalCards } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Cần đăng nhập để lưu tiến độ' });
    const result = await gameProgressService.startOrResumeFlashcardSession(
      req.user.accountId, sessionKey, totalCards
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error('START/RESUME FLASHCARD ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.completeFlashcard = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Cần đăng nhập' });
    const { knownCount } = req.body;
    const result = await gameProgressService.completeFlashcardSession(req.params.sessionId, knownCount);
    if (!result) return res.status(404).json({ message: 'Không tìm thấy phiên' });

    if (result.coins > 0 && req.user.username) {
      const newCoin = (req.user.coin || 0) + result.coins;
      await updateUserCoin(newCoin, req.user.username);
    }

    return res.status(200).json({ session: result.session, coinsAwarded: result.coins });
  } catch (error) {
    console.error('COMPLETE FLASHCARD ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

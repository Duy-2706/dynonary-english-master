const gameApi = require('express').Router();
const gameController = require('../controllers/game.controller');
const { jwtAuthentication, jwtOptional, requireRole } = require('../middlewares/passport.middleware');

// ======== CORRECT WORD GAME ========
gameApi.get('/correct-word/pack', gameController.getWordPackCWG);

// ======== WORD MATCH GAME ========
gameApi.get('/word-match/pack', gameController.getWordPackWMG);

// ======== FAST GAME ========
gameApi.get('/fast-game/pack', gameController.getWordPackFS);

// ======== MULTIPLAYER GAME ROOMS (live) ========
gameApi.post('/room/create', gameController.createRoom);
gameApi.post('/room/join', gameController.joinRoom);
gameApi.get('/room/:pin', gameController.getRoom);
gameApi.post('/room/start', gameController.startRoom);
gameApi.post('/room/answer', gameController.submitAnswer);
gameApi.post('/room/next', gameController.nextQuestion);

// ======== TEACHER ROOM MANAGEMENT ========
gameApi.post('/teacher-room', jwtAuthentication, requireRole('teacher', 'admin'), gameController.createTeacherRoom);
gameApi.get('/teacher-room', jwtAuthentication, requireRole('teacher', 'admin'), gameController.getTeacherRooms);
gameApi.get('/teacher-room/:roomId', jwtOptional, gameController.getTeacherRoom);
gameApi.put('/teacher-room/:roomId', jwtAuthentication, requireRole('teacher', 'admin'), gameController.updateTeacherRoom);
gameApi.delete('/teacher-room/:roomId', jwtAuthentication, requireRole('teacher', 'admin'), gameController.deleteTeacherRoom);
gameApi.post('/teacher-room/:roomId/question', jwtAuthentication, requireRole('teacher', 'admin'), gameController.addQuestion);
gameApi.put('/teacher-room/:roomId/question/:questionId', jwtAuthentication, requireRole('teacher', 'admin'), gameController.updateQuestion);
gameApi.delete('/teacher-room/:roomId/question/:questionId', jwtAuthentication, requireRole('teacher', 'admin'), gameController.deleteQuestion);
gameApi.post('/teacher-room/:roomId/live', jwtAuthentication, requireRole('teacher', 'admin'), gameController.startLiveSession);
gameApi.delete('/teacher-room/:roomId/live', jwtAuthentication, requireRole('teacher', 'admin'), gameController.cancelLiveSession);

// Public: get room by code (for students to join)
gameApi.get('/room-by-code/:roomCode', gameController.getRoomByCode);

// ======== GAME PROGRESS (solo practice) ========
gameApi.post('/progress/start', jwtAuthentication, gameController.startOrResumeProgress);
gameApi.put('/progress/:sessionId', jwtAuthentication, gameController.updateProgress);
gameApi.post('/progress/:sessionId/complete', jwtAuthentication, gameController.completeProgress);
gameApi.get('/progress/attempts/:roomCode', jwtAuthentication, gameController.getGameAttempts);

// ======== FLASHCARD PROGRESS ========
gameApi.post('/flashcard-progress/start', jwtAuthentication, gameController.startOrResumeFlashcard);
gameApi.post('/flashcard-progress/:sessionId/complete', jwtAuthentication, gameController.completeFlashcard);

module.exports = gameApi;

const gameApi = require('express').Router();
const gameController = require('../controllers/game.controller');

// ======== CORRECT WORD GAME ========
gameApi.get('/correct-word/pack', gameController.getWordPackCWG);

// ======== WORD MATCH GAME ========
gameApi.get('/word-match/pack', gameController.getWordPackWMG);

// ======== FAST GAME ========
gameApi.get('/fast-game/pack', gameController.getWordPackFS);

gameApi.post('/room/create', gameController.createRoom);
gameApi.post('/room/join', gameController.joinRoom);
gameApi.get('/room/:pin', gameController.getRoom);
gameApi.post('/room/start', gameController.startRoom);
gameApi.post('/room/answer', gameController.submitAnswer);
gameApi.post('/room/next', gameController.nextQuestion);

module.exports = gameApi;

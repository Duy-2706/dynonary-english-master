const vocabSetApi = require('express').Router();
const vocabSetController = require('../controllers/vocabSet.controller');
const { jwtAuthentication } = require('../middlewares/passport.middleware');

vocabSetApi.get('/', jwtAuthentication, vocabSetController.getMyVocabSets);
vocabSetApi.post('/', jwtAuthentication, vocabSetController.createVocabSet);
vocabSetApi.put('/:id', jwtAuthentication, vocabSetController.updateVocabSet);
vocabSetApi.delete('/:id', jwtAuthentication, vocabSetController.deleteVocabSet);
vocabSetApi.get('/:id/words', vocabSetController.getVocabSetWords);
vocabSetApi.get('/:id', vocabSetController.getVocabSet);

module.exports = vocabSetApi;
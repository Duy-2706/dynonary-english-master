import axiosClient from './axiosClient';

const URL = '/games';

const gameApi = {
  // correct word game
  getWordPackCWG: (
    type = '-1',
    level = '-1',
    specialty = '-1',
    topics = [],
    nQuestion = 50,
  ) => {
    return axiosClient.get(`${URL}/correct-word/pack`, {
      params: {
        type,
        level,
        specialty,
        topics: JSON.stringify(topics),
        nQuestion,
      },
    });
  },

  // word match game
  getWordPackWordMatch: (
    type = '-1',
    level = '-1',
    specialty = '-1',
    topics = [],
    nQuestion = 50,
  ) => {
    return axiosClient.get(`${URL}/word-match/pack`, {
      params: {
        type,
        level,
        specialty,
        topics: JSON.stringify(topics),
        nQuestion,
      },
    });
  },

  // fast game — nhận packInfo đầy đủ
  getWordPackFG: (
    type = '-1',
    level = '-1',
    specialty = '-1',
    topics = [],
  ) => {
    return axiosClient.get(`${URL}/fast-game/pack`, {
      params: {
        type,
        level,
        specialty,
        topics: JSON.stringify(topics),
      },
    });
  },

  createRoom: (data) => axiosClient.post(`${URL}/room/create`, data),
  joinRoom: (data) => axiosClient.post(`${URL}/room/join`, data),
  getRoom: (pin) => axiosClient.get(`${URL}/room/${pin}`),
  startRoom: (data) => axiosClient.post(`${URL}/room/start`, data),
  submitAnswer: (data) => axiosClient.post(`${URL}/room/answer`, data),
  nextQuestion: (data) => axiosClient.post(`${URL}/room/next`, data),
};


export default gameApi;
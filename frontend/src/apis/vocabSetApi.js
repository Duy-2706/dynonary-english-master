import axiosClient from './axiosClient';

const URL = '/vocab-set';

const vocabSetApi = {
  getMyVocabSets: () => axiosClient.get(URL),
  getVocabSet: (id) => axiosClient.get(`${URL}/${id}`),
  getVocabSetWords: (id) => axiosClient.get(`${URL}/${id}/words`),
  createVocabSet: (data) => axiosClient.post(URL, data),
  updateVocabSet: (id, data) => axiosClient.put(`${URL}/${id}`, data),
  deleteVocabSet: (id) => axiosClient.delete(`${URL}/${id}`),
  getClassroomVocabSets: (classroomId) => axiosClient.get(`/classroom/${classroomId}/vocab-sets`),
};

export default vocabSetApi;

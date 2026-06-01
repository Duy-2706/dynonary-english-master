import axiosClient from './axiosClient';

const URL = '/grammar';

const grammarApi = {
  getLessons: (params = {}) => axiosClient.get(`${URL}/lessons`, { params }),
  getLesson: (id) => axiosClient.get(`${URL}/lessons/${id}`),
  getTopics: () => axiosClient.get(`${URL}/topics`),
  getMyLessons: () => axiosClient.get(`${URL}/my-lessons`),
  createLesson: (data) => axiosClient.post(`${URL}/lessons`, data),
  updateLesson: (id, data) => axiosClient.put(`${URL}/lessons/${id}`, data),
  deleteLesson: (id) => axiosClient.delete(`${URL}/lessons/${id}`),
  submitProgress: (id, data) => axiosClient.post(`${URL}/lessons/${id}/progress`, data),
};

export default grammarApi;

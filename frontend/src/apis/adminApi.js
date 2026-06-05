import axiosClient from './axiosClient';

const URL = '/admin';

const adminApi = {
  getUsers: (params = {}) => axiosClient.get(`${URL}/users`, { params }),
  updateUserRole: (id, role) => axiosClient.put(`${URL}/users/${id}/role`, { role }),
  getSystemStats: () => axiosClient.get(`${URL}/stats`),
  getCourseStats: () => axiosClient.get(`${URL}/stats/courses`),
  getGameStats: () => axiosClient.get(`${URL}/stats/games`),
  trackCourseView: (courseId) => axiosClient.post(`${URL}/track/course-view/${courseId}`),
  seedGrammarTenses: () => axiosClient.post(`${URL}/seed-grammar`),
};

export default adminApi;

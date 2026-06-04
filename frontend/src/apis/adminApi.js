import axiosClient from './axiosClient';

const URL = '/admin';

const adminApi = {
  getUsers: (params = {}) => axiosClient.get(`${URL}/users`, { params }),
  updateUserRole: (id, role) => axiosClient.put(`${URL}/users/${id}/role`, { role }),
  getSystemStats: () => axiosClient.get(`${URL}/stats`),
  seedGrammarTenses: () => axiosClient.post(`${URL}/seed-grammar`),
};

export default adminApi;

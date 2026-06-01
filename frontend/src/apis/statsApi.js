import axiosClient from './axiosClient';

const URL = '/stats';

const statsApi = {
  getStudentStats: () => axiosClient.get(`${URL}/student`),
  getTeacherStats: () => axiosClient.get(`${URL}/teacher`),
};

export default statsApi;

import axiosClient from './axiosClient';

const URL = '/classroom';

const classroomApi = {
  getMyClassrooms: () => {
    return axiosClient.get(URL);
  },

  createClassroom: (data) => {
    return axiosClient.post(URL, data);
  },

  updateClassroom: (id, data) => {
    return axiosClient.put(`${URL}/${id}`, data);
  },

  deleteClassroom: (id) => {
    return axiosClient.delete(`${URL}/${id}`);
  },
};

export default classroomApi;
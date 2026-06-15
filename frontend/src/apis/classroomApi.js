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

  
  getClassroomById: (id) => {
    return axiosClient.get(`${URL}/${id}`);
  },

  getActivity: (id) => {
    return axiosClient.get(`${URL}/${id}/activity`);
  },

  getWeeklyReport: (id, weekNumber, year) => {
    return axiosClient.get(`${URL}/${id}/weekly-report`, {
      params: { weekNumber, year },
    });
  },

  upsertWeeklyEvaluation: (id, data) => {
    return axiosClient.post(`${URL}/${id}/weekly-evaluation`, data);
  },
};

export default classroomApi;
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
   // Assignments – teacher
  createAssignment: (data) => axiosClient.post(`${URL}/assignments`, data),
  getMyAssignments: () => axiosClient.get(`${URL}/assignments/mine`),
  updateAssignment: (id, data) => axiosClient.put(`${URL}/assignments/${id}`, data),
  deleteAssignment: (id) => axiosClient.delete(`${URL}/assignments/${id}`),
  getSubmissions: (id) => axiosClient.get(`${URL}/assignments/${id}/submissions`),
  // Assignments – student
  getClassroomAssignments: (classroomId) => axiosClient.get(`${URL}/assignments/classroom/${classroomId}`),
  submitAssignment: (id, data) => axiosClient.post(`${URL}/assignments/${id}/submit`, data),
  getMySubmissions: () => axiosClient.get(`${URL}/submissions/mine`),
};

export default grammarApi;

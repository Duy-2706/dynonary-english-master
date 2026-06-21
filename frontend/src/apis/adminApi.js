import axiosClient from './axiosClient';

const URL = '/admin';

const adminApi = {
  getUsers: (params = {}) => axiosClient.get(`${URL}/users`, { params }),
  updateUserRole: (id, role) => axiosClient.put(`${URL}/users/${id}/role`, { role }),
  lockUser: (id) => axiosClient.put(`${URL}/users/${id}/lock`),
  unlockUser: (id) => axiosClient.put(`${URL}/users/${id}/unlock`),
  getSystemStats: () => axiosClient.get(`${URL}/stats`),
  getCourseStats: () => axiosClient.get(`${URL}/stats/courses`),
  getGameStats: () => axiosClient.get(`${URL}/stats/games`),
  trackCourseView: (courseId) => axiosClient.post(`${URL}/track/course-view/${courseId}`),
  seedGrammarTenses: () => axiosClient.post(`${URL}/seed-grammar`),

   // Account creation
  createTeachers: (teachers) => axiosClient.post(`${URL}/accounts/teachers`, { teachers }),
  createStudents: (students, classroomId, classroomName) =>
    axiosClient.post(`${URL}/accounts/students`, { students, classroomId, classroomName }),
    // Teacher update / delete
  updateTeacher: (id, data) => axiosClient.put(`${URL}/teachers/${id}`, data),
  deleteTeacher: (id) => axiosClient.delete(`${URL}/teachers/${id}`),
  // Classrooms
  getClassrooms: () => axiosClient.get(`${URL}/classrooms`),
  createClassroom: (data) => axiosClient.post(`${URL}/classrooms`, data),

    // Grammar admin
  getGrammarLessons: () => axiosClient.get(`${URL}/grammar/lessons`),
  createGrammarLesson: (data) => axiosClient.post(`${URL}/grammar/lessons`, data),
  updateGrammarLesson: (id, data) => axiosClient.put(`${URL}/grammar/lessons/${id}`, data),
  deleteGrammarLesson: (id) => axiosClient.delete(`${URL}/grammar/lessons/${id}`),
  uploadGrammarImage: (image) => axiosClient.post(`${URL}/grammar/upload-image`, { image }),


  getWords: (params = {}) => axiosClient.get(`${URL}/words`, { params }),
  createWord: (data) => axiosClient.post(`${URL}/words`, data),
  updateWord: (id, data) => axiosClient.put(`${URL}/words/${id}`, data),
  deleteWord: (id) => axiosClient.delete(`${URL}/words/${id}`),

};

export default adminApi;

import axiosClient from './axiosClient';

const URL = '/course';

const courseApi = {
  // ===== PUBLIC =====
  getPublishedCourses: (page = 1, limit = 12) => {
    return axiosClient.get(`${URL}/published`, { params: { page, limit } });
  },

  getCourseDetail: (id) => {
    return axiosClient.get(`${URL}/${id}/detail`);
  },

  // ===== TEACHER =====
  getTeacherCourses: () => {
    return axiosClient.get(`${URL}/my-courses/teacher`);
  },

  createCourse: (data) => {
    return axiosClient.post(URL, data);
  },

  updateCourse: (id, data) => {
    return axiosClient.put(`${URL}/${id}`, data);
  },

  deleteCourse: (id) => {
    return axiosClient.delete(`${URL}/${id}`);
  },

  // ===== CHAPTER =====
  createChapter: (courseId, data) => {
    return axiosClient.post(`${URL}/${courseId}/chapters`, data);
  },

  updateChapter: (courseId, chapterId, data) => {
    return axiosClient.put(`${URL}/${courseId}/chapters/${chapterId}`, data);
  },

  deleteChapter: (courseId, chapterId) => {
    return axiosClient.delete(`${URL}/${courseId}/chapters/${chapterId}`);
  },

  // ===== LESSON =====
  getLessonDetail: (lessonId) => {
    return axiosClient.get(`${URL}/lessons/${lessonId}`);
  },

  createLesson: (courseId, chapterId, data) => {
    return axiosClient.post(
      `${URL}/${courseId}/chapters/${chapterId}/lessons`,
      data,
    );
  },

  updateLesson: (courseId, lessonId, data) => {
    return axiosClient.put(`${URL}/${courseId}/lessons/${lessonId}`, data);
  },

  deleteLesson: (courseId, lessonId) => {
    return axiosClient.delete(`${URL}/${courseId}/lessons/${lessonId}`);
  },

  // ===== ENROLLMENT =====
  enrollCourse: (courseId) => {
    return axiosClient.post(`${URL}/${courseId}/enroll`);
  },

  getStudentCourses: () => {
    return axiosClient.get(`${URL}/my-courses/student`);
  },

 // ===== PROGRESS =====
  updateLessonProgress: (courseId, lessonId, data) => {
    return axiosClient.post(
      `${URL}/${courseId}/lessons/${lessonId}/progress`,
      data,
    );
  },

  // ===== ENROLLMENT MANAGEMENT =====   ← THÊM ĐOẠN NÀY
  getPendingEnrollments: () => {
    return axiosClient.get(`${URL}/enrollments/pending`);
  },
  approveEnrollment: (enrollmentId) => {
    return axiosClient.put(`${URL}/enrollments/${enrollmentId}/approve`);
  },
  rejectEnrollment: (enrollmentId) => {
    return axiosClient.put(`${URL}/enrollments/${enrollmentId}/reject`);
  },
};
export default courseApi;
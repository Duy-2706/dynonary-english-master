const courseApi = require('express').Router();
const courseController = require('../controllers/course.controller');
const passportConfig = require('../middlewares/passport.middleware');
const auth = passportConfig.jwtAuthentication;
const optionalAuth = passportConfig.jwtOptional;

// ===== ENROLLMENT MANAGEMENT (phải đứng TRƯỚC /:id) =====
courseApi.get('/enrollments/pending', auth, courseController.getPendingEnrollments);
courseApi.put('/enrollments/:enrollmentId/approve', auth, courseController.approveEnrollment);
courseApi.put('/enrollments/:enrollmentId/reject', auth, courseController.rejectEnrollment);

// ===== PUBLIC =====
courseApi.get('/published', courseController.getPublishedCourses);
courseApi.get('/:id/detail', optionalAuth, courseController.getCourseDetail);

// ===== MY COURSES =====
courseApi.get('/my-courses/teacher', auth, courseController.getTeacherCourses);
courseApi.get('/my-courses/student', auth, courseController.getStudentCourses);

// ===== COURSE CRUD =====
courseApi.post('/', auth, courseController.createCourse);
courseApi.put('/:id', auth, courseController.updateCourse);
courseApi.delete('/:id', auth, courseController.deleteCourse);

// ===== CHAPTER =====
courseApi.post('/:courseId/chapters', auth, courseController.createChapter);
courseApi.put('/:courseId/chapters/:id', auth, courseController.updateChapter);
courseApi.delete('/:courseId/chapters/:id', auth, courseController.deleteChapter);

// ===== LESSON =====
courseApi.get('/lessons/:id', optionalAuth, courseController.getLessonDetail);
courseApi.post('/:courseId/chapters/:chapterId/lessons', auth, courseController.createLesson);
courseApi.put('/:courseId/lessons/:id', auth, courseController.updateLesson);
courseApi.delete('/:courseId/lessons/:id', auth, courseController.deleteLesson);

// ===== ENROLLMENT =====
courseApi.post('/:courseId/enroll', auth, courseController.enrollCourse);

// ===== PROGRESS =====
courseApi.post('/:courseId/lessons/:lessonId/progress', auth, courseController.updateLessonProgress);

module.exports = courseApi;
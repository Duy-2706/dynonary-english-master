import axiosClient from './axiosClient';

const URL = '/games';

const gameRoomApi = {
  // ── Teacher room management ──────────────────────────────────────────────
  createTeacherRoom: (data) => axiosClient.post(`${URL}/teacher-room`, data),
  getTeacherRooms: () => axiosClient.get(`${URL}/teacher-room`),
  getTeacherRoom: (roomId) => axiosClient.get(`${URL}/teacher-room/${roomId}`),
  updateTeacherRoom: (roomId, data) => axiosClient.put(`${URL}/teacher-room/${roomId}`, data),
  deleteTeacherRoom: (roomId) => axiosClient.delete(`${URL}/teacher-room/${roomId}`),

  addQuestion: (roomId, data) => axiosClient.post(`${URL}/teacher-room/${roomId}/question`, data),
  updateQuestion: (roomId, questionId, data) =>
    axiosClient.put(`${URL}/teacher-room/${roomId}/question/${questionId}`, data),
  deleteQuestion: (roomId, questionId) =>
    axiosClient.delete(`${URL}/teacher-room/${roomId}/question/${questionId}`),

  
  startLiveSession: (roomId) =>
    axiosClient.post(`${URL}/teacher-room/${roomId}/live`, {}),

  // Cancel the active live session
  cancelLiveSession: (roomId) =>
    axiosClient.delete(`${URL}/teacher-room/${roomId}/live`),


  // ── Student: find room by code ───────────────────────────────────────────
  getRoomByCode: (roomCode) => axiosClient.get(`${URL}/room-by-code/${roomCode}`),

  // ── Solo game progress ───────────────────────────────────────────────────
  startOrResumeProgress: (data) => axiosClient.post(`${URL}/progress/start`, data),
  updateProgress: (sessionId, data) => axiosClient.put(`${URL}/progress/${sessionId}`, data),
  completeProgress: (sessionId) => axiosClient.post(`${URL}/progress/${sessionId}/complete`),
  getAttempts: (roomCode) => axiosClient.get(`${URL}/progress/attempts/${roomCode}`),

  // ── Flashcard progress ───────────────────────────────────────────────────
  startOrResumeFlashcard: (data) => axiosClient.post(`${URL}/flashcard-progress/start`, data),
  completeFlashcard: (sessionId, data) =>
    axiosClient.post(`${URL}/flashcard-progress/${sessionId}/complete`, data),
};

export default gameRoomApi;

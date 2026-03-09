import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getByTeacher: (id) => api.get(`/courses/teacher/${id}`),
  getByStudent: (id) => api.get(`/courses/student/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (courseId, studentId) =>
    api.post(`/courses/${courseId}/enroll/${studentId}`),
  unenroll: (courseId, studentId) =>
    api.delete(`/courses/${courseId}/unenroll/${studentId}`),
};

export const assignmentAPI = {
  getByCourse: (courseId) =>
    api.get(`/courses/${courseId}/assignments`),
  create: (courseId, data) =>
    api.post(`/courses/${courseId}/assignments`, data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  grade: (assignmentId, studentId, data) =>
    api.post(`/assignments/${assignmentId}/grade/${studentId}`, data),
  getStudentGrades: (studentId) =>
    api.get(`/grades/student/${studentId}`),
  getAssignmentGrades: (assignmentId) =>
    api.get(`/assignments/${assignmentId}/grades`),
};

export const noticeAPI = {
  getGeneral: () => api.get('/notices/general'),
  getByCourse: (courseId) => api.get(`/notices/course/${courseId}`),
  getPinned: () => api.get('/notices/pinned'),
  create: (data, authorId, courseId) =>
    api.post(
      `/notices?authorId=${authorId}${courseId
        ? `&courseId=${courseId}` : ''}`, data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`),
};

export const attendanceAPI = {
  getByCourseAndDate: (courseId, date) =>
    api.get(`/attendance/course/${courseId}?date=${date}`),
  getStudentAttendance: (studentId, courseId) =>
    api.get(`/attendance/student/${studentId}/course/${courseId}`),
  getSummary: (studentId, courseId) =>
    api.get(`/attendance/student/${studentId}/course/${courseId}/summary`),
  mark: (data) => api.post('/attendance/mark', data),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getByRole: (role) => api.get(`/users/role/${role}`),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
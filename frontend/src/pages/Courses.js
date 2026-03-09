/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { courseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [form, setForm] = useState({
    title: '', courseCode: '', description: '',
    category: '', credits: 3, semester: '', maxStudents: 30
  });
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  const { cardBg, text, textMuted, border, inputBg, isDark } = useTheme();

  const cardStyle = { backgroundColor: cardBg, color: text, border: `1px solid ${border}` };

  const fetchMyCourses = async () => {
    try {
      let res;
      if (isAdmin()) res = await courseAPI.getAll();
      else if (isTeacher()) res = await courseAPI.getByTeacher(user.userId);
      else res = await courseAPI.getByStudent(user.userId);
      return res?.data?.data || [];
    } catch (e) { console.error(e); return []; }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      return res?.data?.data || [];
    } catch (e) { console.error(e); return []; }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const my = await fetchMyCourses();
      setCourses(my);
      if (isStudent()) {
        const all = await fetchAllCourses();
        setAllCourses(all);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const teacher = isTeacher() ? { id: user.userId } : null;
      await courseAPI.create({ ...form, teacher });
      setShowModal(false);
      setForm({ title: '', courseCode: '', description: '', category: '', credits: 3, semester: '', maxStudents: 30 });
      const my = await fetchMyCourses();
      setCourses(my);
      alert('✅ Course created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseAPI.delete(id);
      const my = await fetchMyCourses();
      setCourses(my);
    } catch (e) { alert('Error deleting course'); }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseAPI.enroll(courseId, user.userId);
      const [my, all] = await Promise.all([fetchMyCourses(), fetchAllCourses()]);
      setCourses(my);
      setAllCourses(all);
      alert('✅ Enrolled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling');
    }
  };

  const categoryColors = {
    'Computer Science': '#1a237e', 'Mathematics': '#2e7d32',
    'Physics': '#e65100', 'Business': '#6a1b9a', 'Arts': '#c62828'
  };

  const enrolledIds = new Set(courses.map(c => c.id));
  const displayCourses = isStudent() && activeTab === 'all' ? allCourses : courses;

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#1a237e' }}></div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: text }}>Courses</h4>
          <p className="mb-0" style={{ color: textMuted }}>
            {displayCourses.length} course{displayCourses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {isStudent() && (
            <div className="btn-group">
              <button className={`btn btn-sm ${activeTab === 'my' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('my')}>
                My Courses
              </button>
              <button className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('all')}>
                Browse All
              </button>
            </div>
          )}
          {(isAdmin() || isTeacher()) && (
            <button className="btn text-white fw-semibold rounded-3 px-4"
              style={{ background: '#1a237e' }}
              onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-lg me-2"></i>New Course
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">
        {displayCourses.length === 0 ? (
          <div className="col-12 text-center py-5" style={{ color: textMuted }}>
            <i className="bi bi-book fs-1 d-block mb-3"></i>
            <h5>No courses found</h5>
            {isStudent() && activeTab === 'my' && (
              <button className="btn btn-outline-primary mt-2"
                onClick={() => setActiveTab('all')}>
                Browse Available Courses
              </button>
            )}
          </div>
        ) : displayCourses.map(course => (
          <div key={course.id} className="col-xl-3 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 h-100" style={cardStyle}>
              <div className="card-header border-0 rounded-top-4 py-3 text-white"
                style={{ background: categoryColors[course.category] || '#1a237e' }}>
                <div className="d-flex justify-content-between align-items-start">
                  <span className="badge bg-white text-dark px-2">{course.courseCode}</span>
                  <span className="badge bg-white bg-opacity-25">{course.credits} CR</span>
                </div>
                <h6 className="fw-bold mt-2 mb-0">{course.title}</h6>
              </div>
              <div className="card-body p-3">
                <p className="small mb-3" style={{ color: textMuted }}>
                  {course.description?.substring(0, 90) || 'No description'}
                </p>
                <div className="d-flex justify-content-between small" style={{ color: textMuted }}>
                  <span><i className="bi bi-people me-1"></i>
                    {course.students?.length || 0}/{course.maxStudents}
                  </span>
                  <span><i className="bi bi-calendar me-1"></i>
                    {course.semester || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="card-footer border-0 pb-3 px-3"
                style={{ backgroundColor: cardBg }}>
                {isStudent() && !enrolledIds.has(course.id) && (
                  <button className="btn btn-sm w-100 fw-semibold text-white mb-1"
                    style={{ background: '#2e7d32' }}
                    onClick={() => handleEnroll(course.id)}>
                    <i className="bi bi-plus-circle me-1"></i>Enroll
                  </button>
                )}
                {isStudent() && enrolledIds.has(course.id) && (
                  <span className="badge bg-success w-100 py-2">
                    <i className="bi bi-check-circle me-1"></i>Enrolled
                  </span>
                )}
                {(isAdmin() || isTeacher()) && (
                  <button className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => handleDelete(course.id)}>
                    <i className="bi bi-trash me-1"></i>Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0" style={{ backgroundColor: cardBg, color: text }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-plus-circle me-2" style={{ color: '#1a237e' }}></i>
                  Create New Course
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}
                  style={isDark ? { filter: 'invert(1)' } : {}}></button>
              </div>
              <div className="modal-body px-4">
                <form onSubmit={handleCreate}>
                  <div className="row g-3">
                    <div className="col-8">
                      <label className="form-label fw-semibold">Course Title *</label>
                      <input className="form-control" placeholder="e.g. Introduction to Programming"
                        required style={{ backgroundColor: inputBg, color: text, borderColor: border }}
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-semibold">Course Code *</label>
                      <input className="form-control" placeholder="e.g. CS101" required
                        style={{ backgroundColor: inputBg, color: text, borderColor: border }}
                        value={form.courseCode}
                        onChange={e => setForm({ ...form, courseCode: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea className="form-control" rows={3} placeholder="Course description..."
                        style={{ backgroundColor: inputBg, color: text, borderColor: border }}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-semibold">Category</label>
                      <select className="form-select"
                        style={{ backgroundColor: inputBg, color: text, borderColor: border }}
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}>
                        <option value="">Select...</option>
                        {['Computer Science', 'Mathematics', 'Physics', 'Business', 'Arts'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-semibold">Credits</label>
                      <input type="number" className="form-control" min={1} max={6}
                        style={{ backgroundColor: inputBg, color: text, borderColor: border }}
                        value={form.credits}
                        onChange={e => setForm({ ...form, credits: parseInt(e.target.value) })} />
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-semibold">Max Students</label>
                      <input type="number" className="form-control" min={1}
                        style={{ backgroundColor: inputBg, color: text, borderColor: border }}
                        value={form.maxStudents}
                        onChange={e => setForm({ ...form, maxStudents: parseInt(e.target.value) })} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Semester</label>
                      <input className="form-control" placeholder="e.g. Spring 2024"
                        style={{ backgroundColor: inputBg, color: text, borderColor: border }}
                        value={form.semester}
                        onChange={e => setForm({ ...form, semester: e.target.value })} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary rounded-3"
                      onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn text-white rounded-3 px-4"
                      style={{ background: '#1a237e' }}>
                      <i className="bi bi-plus me-1"></i>Create Course
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

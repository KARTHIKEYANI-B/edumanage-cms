/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { courseAPI, noticeAPI, userAPI } from '../services/api';

const Dashboard = () => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  const { cardBg, text, textMuted, border, isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let c;
        if (isAdmin()) {
          c = await courseAPI.getAll();
          const u = await userAPI.getAll();
          setUserCount(u.data.data.length);
        } else if (isTeacher()) {
          c = await courseAPI.getByTeacher(user.userId);
        } else {
          c = await courseAPI.getByStudent(user.userId);
        }
        setCourses(c?.data?.data || []);
        const n = await noticeAPI.getGeneral();
        setNotices((n?.data?.data || []).slice(0, 4));
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const cardStyle = {
    backgroundColor: cardBg,
    color: text,
    border: `1px solid ${border}`
  };

  const stats = [
    { label: isAdmin() ? 'Total Courses' : 'My Courses',
      value: courses.length, icon: 'bi-book-fill',
      color: '#1a237e', link: '/courses' },
    ...(isAdmin() ? [{ label: 'Total Users', value: userCount,
      icon: 'bi-people-fill', color: '#2e7d32', link: '/admin/users' }] : []),
    { label: 'Notices', value: notices.length,
      icon: 'bi-bell-fill', color: '#e65100', link: '/notices' },
    { label: 'Attendance', icon: 'bi-calendar-check-fill',
      value: 'View', color: '#6a1b9a', link: '/attendance' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="rounded-4 mb-4 p-4 text-white shadow"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0d0d1a, #1a237e)'
            : 'linear-gradient(135deg, #1a237e, #3949ab)'
        }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold mb-1">
              Welcome back, {user?.firstName}! 👋
            </h3>
            <p className="mb-0 opacity-75">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric',
                month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <i className="bi bi-mortarboard-fill opacity-25"
            style={{ fontSize: '5rem' }}></i>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="col-md-3 col-6">
            <Link to={s.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm rounded-4 h-100"
                style={cardStyle}>
                <div className="card-body p-4 d-flex align-items-center gap-3">
                  <div className="rounded-3 p-3"
                    style={{ background: `${s.color}25` }}>
                    <i className={`bi ${s.icon} fs-4`}
                      style={{ color: s.color }}></i>
                  </div>
                  <div>
                    <p className="mb-0 small" style={{ color: textMuted }}>
                      {s.label}
                    </p>
                    <h3 className="fw-bold mb-0" style={{ color: s.color }}>
                      {s.value}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Courses */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm rounded-4" style={cardStyle}>
            <div className="card-header border-0 rounded-top-4 pt-4 px-4"
              style={{ backgroundColor: cardBg }}>
              <h5 className="fw-bold mb-0" style={{ color: text }}>
                <i className="bi bi-book me-2" style={{ color: '#1a237e' }}></i>
                {isAdmin() ? 'All Courses' : isTeacher()
                  ? 'My Teaching Courses' : 'My Enrolled Courses'}
              </h5>
            </div>
            <div className="card-body px-4 pb-4">
              {courses.length === 0 ? (
                <div className="text-center py-4"
                  style={{ color: textMuted }}>
                  <i className="bi bi-book fs-1 d-block mb-2"></i>
                  No courses yet
                </div>
              ) : courses.slice(0, 5).map(course => (
                <div key={course.id}
                  className="d-flex justify-content-between align-items-center py-3"
                  style={{ borderBottom: `1px solid ${border}` }}>
                  <div>
                    <p className="fw-semibold mb-0" style={{ color: text }}>
                      {course.title}
                    </p>
                    <small style={{ color: textMuted }}>
                      {course.courseCode} • {course.category}
                    </small>
                  </div>
                  <span className="badge rounded-pill px-3"
                    style={{ background: '#e8eaf6', color: '#1a237e' }}>
                    {course.credits} CR
                  </span>
                </div>
              ))}
              <Link to="/courses" className="btn btn-sm mt-3 fw-semibold"
                style={{ color: '#1a237e' }}>
                View all <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm rounded-4" style={cardStyle}>
            <div className="card-header border-0 rounded-top-4 pt-4 px-4"
              style={{ backgroundColor: cardBg }}>
              <h5 className="fw-bold mb-0" style={{ color: text }}>
                <i className="bi bi-bell me-2 text-warning"></i>
                Recent Notices
              </h5>
            </div>
            <div className="card-body px-4 pb-4">
              {notices.length === 0 ? (
                <div className="text-center py-4"
                  style={{ color: textMuted }}>
                  <i className="bi bi-bell-slash fs-1 d-block mb-2"></i>
                  No notices yet
                </div>
              ) : notices.map(n => (
                <div key={n.id} className="mb-3 p-3 rounded-3"
                  style={{
                    background: isDark ? '#0f3460' : '#f8f9fa',
                    border: `1px solid ${border}`
                  }}>
                  <div className="d-flex justify-content-between">
                    <p className="fw-semibold mb-1 small"
                      style={{ color: text }}>{n.title}</p>
                    {n.pinned && (
                      <i className="bi bi-pin-fill text-danger small"></i>
                    )}
                  </div>
                  <small style={{ color: textMuted }}>
                    {n.content?.substring(0, 70)}...
                  </small>
                </div>
              ))}
              <Link to="/notices" className="btn btn-sm fw-semibold"
                style={{ color: '#1a237e' }}>
                View all <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
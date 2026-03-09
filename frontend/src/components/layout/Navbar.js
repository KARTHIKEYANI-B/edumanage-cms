import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const { isDark, toggleTheme, navBg } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3"
      style={{ background: navBg }}>
      <Link className="navbar-brand fw-bold fs-4" to="/dashboard">
        <i className="bi bi-mortarboard-fill me-2"></i>EduManage
      </Link>
      <button className="navbar-toggler border-0" type="button"
        data-bs-toggle="collapse" data-bs-target="#navMain">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navMain">
        <ul className="navbar-nav me-auto gap-1">
          <li className="nav-item">
            <Link className="nav-link rounded-3 px-3" to="/dashboard">
              <i className="bi bi-speedometer2 me-1"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link rounded-3 px-3" to="/courses">
              <i className="bi bi-book me-1"></i>Courses
            </Link>
          </li>
          {isStudent() && (
            <li className="nav-item">
              <Link className="nav-link rounded-3 px-3" to="/my-grades">
                <i className="bi bi-award me-1"></i>My Grades
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link rounded-3 px-3" to="/notices">
              <i className="bi bi-bell me-1"></i>Notices
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link rounded-3 px-3" to="/attendance">
              <i className="bi bi-calendar-check me-1"></i>Attendance
            </Link>
          </li>
          {isAdmin() && (
            <li className="nav-item">
              <Link className="nav-link rounded-3 px-3" to="/admin/users">
                <i className="bi bi-people me-1"></i>Users
              </Link>
            </li>
          )}
        </ul>
        <div className="d-flex align-items-center gap-2">
          {/* 🌙 Dark/Light Theme Toggle */}
          <button className="btn btn-outline-light btn-sm rounded-circle"
            onClick={toggleTheme}
            style={{ width: 36, height: 36 }}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
            <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
          </button>
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
            {user?.role}
          </span>
          <span className="text-white fw-semibold d-none d-lg-block">
            {user?.firstName} {user?.lastName}
          </span>
          <button className="btn btn-outline-light btn-sm rounded-3"
            onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
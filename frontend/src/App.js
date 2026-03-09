/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Notices from './pages/Notices';
import Attendance from './pages/Attendance';
import MyGrades from './pages/MyGrades';
import Users from './pages/admin/Users';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="spinner-border" style={{ color: '#1a237e' }}></div>
    </div>
  );
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard"
        element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/courses"
        element={<PrivateRoute><Courses /></PrivateRoute>} />
      <Route path="/notices"
        element={<PrivateRoute><Notices /></PrivateRoute>} />
      <Route path="/attendance"
        element={<PrivateRoute><Attendance /></PrivateRoute>} />
      <Route path="/my-grades"
        element={<PrivateRoute><MyGrades /></PrivateRoute>} />
      <Route path="/admin/users"
        element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
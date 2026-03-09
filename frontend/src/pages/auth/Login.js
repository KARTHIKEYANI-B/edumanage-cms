import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)'
      }}>
      <div className="col-md-4">
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill text-white"
            style={{ fontSize: '3rem' }}></i>
          <h2 className="text-white fw-bold mt-2">EduManage</h2>
          <p className="text-white-50">Course Management System</p>
        </div>
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h4 className="fw-bold mb-4 text-center"
              style={{ color: '#1a237e' }}>
              Welcome Back
            </h4>
            {error && (
              <div className="alert alert-danger rounded-3">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control bg-light"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required />
              </div>
              <button
                type="submit"
                className="btn w-100 py-2 fw-semibold text-white rounded-3"
                style={{
                  background: 'linear-gradient(135deg, #1a237e, #3949ab)'
                }}
                disabled={loading}>
                {loading
                  ? <span className="spinner-border spinner-border-sm me-2"></span>
                  : <i className="bi bi-box-arrow-in-right me-2"></i>}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <hr className="my-4" />
            <p className="text-center text-muted mb-0">
              New user?{' '}
              <Link to="/register"
                className="text-decoration-none fw-semibold"
                style={{ color: '#1a237e' }}>
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
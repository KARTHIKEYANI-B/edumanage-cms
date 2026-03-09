import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Register = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    firstName: '', lastName: '', phone: '', role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4"
      style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)'
      }}>
      <div className="col-md-5">
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill text-white"
            style={{ fontSize: '3rem' }}></i>
          <h2 className="text-white fw-bold mt-2">EduManage</h2>
        </div>
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h4 className="fw-bold mb-4 text-center"
              style={{ color: '#1a237e' }}>
              Create Account
            </h4>
            {error && (
              <div className="alert alert-danger rounded-3">{error}</div>
            )}
            {success && (
              <div className="alert alert-success rounded-3">{success}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">First Name</label>
                  <input className="form-control bg-light"
                    placeholder="First name" required
                    value={form.firstName}
                    onChange={e =>
                      setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input className="form-control bg-light"
                    placeholder="Last name" required
                    value={form.lastName}
                    onChange={e =>
                      setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Username</label>
                  <input className="form-control bg-light"
                    placeholder="Choose a username" required
                    value={form.username}
                    onChange={e =>
                      setForm({ ...form, username: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control bg-light"
                    placeholder="Enter email" required
                    value={form.email}
                    onChange={e =>
                      setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Password</label>
                  <input type="password" className="form-control bg-light"
                    placeholder="Create password" required minLength={6}
                    value={form.password}
                    onChange={e =>
                      setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Role</label>
                  <select className="form-select bg-light"
                    value={form.role}
                    onChange={e =>
                      setForm({ ...form, role: e.target.value })}>
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="btn w-100 py-2 fw-semibold text-white rounded-3 mt-4"
                style={{
                  background: 'linear-gradient(135deg, #1a237e, #3949ab)'
                }}
                disabled={loading}>
                {loading
                  ? <span className="spinner-border spinner-border-sm me-2"></span>
                  : <i className="bi bi-person-plus me-2"></i>}
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-muted mt-3 mb-0">
              Already have an account?{' '}
              <Link to="/login"
                className="text-decoration-none fw-semibold"
                style={{ color: '#1a237e' }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
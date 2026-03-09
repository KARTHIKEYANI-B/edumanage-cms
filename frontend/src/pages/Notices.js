import React, { useEffect, useState } from 'react';
import { noticeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const typeColors = {
  GENERAL: 'primary', COURSE: 'success',
  EXAM: 'danger', EVENT: 'warning'
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', type: 'GENERAL', pinned: false
  });
  const { user, isAdmin, isTeacher } = useAuth();

  const fetchNotices = async () => {
    try {
      const res = await noticeAPI.getGeneral();
      setNotices(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await noticeAPI.create(form, user.userId, null);
      setShowModal(false);
      setForm({ title: '', content: '', type: 'GENERAL', pinned: false });
      fetchNotices();
    } catch (err) {
      alert('Error creating notice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await noticeAPI.delete(id);
    fetchNotices();
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#1a237e' }}></div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Notices & Announcements</h4>
          <p className="text-muted mb-0">
            {notices.length} notice{notices.length !== 1 ? 's' : ''}
          </p>
        </div>
        {(isAdmin() || isTeacher()) && (
          <button
            className="btn text-white fw-semibold rounded-3 px-4"
            style={{ background: '#1a237e' }}
            onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>New Notice
          </button>
        )}
      </div>

      <div className="row g-3">
        {notices.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <i className="bi bi-bell-slash fs-1 d-block mb-3"></i>
            <h5>No notices yet</h5>
          </div>
        ) : (
          notices.map(notice => (
            <div key={notice.id} className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className={`badge bg-${typeColors[notice.type]}
                      rounded-pill px-3`}>
                      {notice.type}
                    </span>
                    <div className="d-flex gap-2 align-items-center">
                      {notice.pinned && (
                        <i className="bi bi-pin-angle-fill text-danger"></i>
                      )}
                      {(isAdmin() || isTeacher()) && (
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle p-1"
                          onClick={() => handleDelete(notice.id)}>
                          <i className="bi bi-trash"
                            style={{ fontSize: '0.75rem' }}></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <h6 className="fw-bold mt-2">{notice.title}</h6>
                  <p className="text-muted small mb-3">{notice.content}</p>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">
                      <i className="bi bi-person me-1"></i>
                      {notice.author?.firstName} {notice.author?.lastName}
                    </small>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {notice.createdAt
                        ? new Date(notice.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Notice Modal */}
      {showModal && (
        <div className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Create Notice</h5>
                <button className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body px-4">
                <form onSubmit={handleCreate}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input className="form-control bg-light"
                      placeholder="Notice title" required
                      value={form.title}
                      onChange={e =>
                        setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Content</label>
                    <textarea className="form-control bg-light" rows={4}
                      placeholder="Notice content..." required
                      value={form.content}
                      onChange={e =>
                        setForm({ ...form, content: e.target.value })}>
                    </textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Type</label>
                    <select className="form-select bg-light"
                      value={form.type}
                      onChange={e =>
                        setForm({ ...form, type: e.target.value })}>
                      {['GENERAL', 'COURSE', 'EXAM', 'EVENT'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input"
                      id="pinned"
                      checked={form.pinned}
                      onChange={e =>
                        setForm({ ...form, pinned: e.target.checked })} />
                    <label className="form-check-label" htmlFor="pinned">
                      Pin this notice
                    </label>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button"
                      className="btn btn-light rounded-3"
                      onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit"
                      className="btn text-white rounded-3"
                      style={{ background: '#1a237e' }}>
                      Post Notice
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

export default Notices;
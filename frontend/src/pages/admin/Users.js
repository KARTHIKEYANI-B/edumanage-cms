import React, { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';

const roleColors = {
  ADMIN: '#c62828',
  TEACHER: '#1565c0',
  STUDENT: '#2e7d32'
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userAPI.getAll();
        setUsers(res.data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    await userAPI.delete(id);
    setUsers(users.filter(u => u.id !== id));
  };

  const filtered = filter === 'ALL'
    ? users
    : users.filter(u => u.role === filter);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#1a237e' }}></div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">User Management</h4>
          <p className="text-muted mb-0">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="d-flex gap-2">
          {['ALL', 'ADMIN', 'TEACHER', 'STUDENT'].map(r => (
            <button key={r}
              className={`btn btn-sm rounded-pill px-3 ${
                filter === r ? 'text-white' : 'btn-outline-secondary'
              }`}
              style={filter === r ? { background: '#1a237e' } : {}}
              onClick={() => setFilter(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th className="pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{
                          width: 40, height: 40,
                          background: roleColors[u.role] || '#1a237e'
                        }}>
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <p className="mb-0 fw-semibold">
                          {u.firstName} {u.lastName}
                        </p>
                        <small className="text-muted">@{u.username}</small>
                      </div>
                    </div>
                  </td>
                  <td className="small">{u.email}</td>
                  <td className="small text-muted">{u.phone || '-'}</td>
                  <td>
                    <span className="badge rounded-pill px-3 py-2"
                      style={{
                        background: `${roleColors[u.role]}20`,
                        color: roleColors[u.role]
                      }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-2 bg-${u.active ? 'success' : 'danger'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="pe-4">
                    <button
                      className="btn btn-sm btn-outline-danger rounded-3"
                      onClick={() => handleDelete(u.id)}>
                      <i className="bi bi-person-x me-1"></i>Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
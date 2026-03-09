/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import React, { useEffect, useState } from 'react';
import { assignmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await assignmentAPI.getStudentGrades(user.userId);
        setGrades(res.data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const avg = grades.length > 0
    ? (grades.reduce((s, g) => s + g.score, 0) / grades.length).toFixed(1)
    : 0;

  const getGradeLabel = (score, max) => {
    const pct = (score / (max || 100)) * 100;
    if (pct >= 90) return { label: 'A', color: '#2e7d32' };
    if (pct >= 80) return { label: 'B', color: '#1565c0' };
    if (pct >= 70) return { label: 'C', color: '#e65100' };
    if (pct >= 60) return { label: 'D', color: '#6a1b9a' };
    return { label: 'F', color: '#c62828' };
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#1a237e' }}></div>
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">My Grades</h4>
        <p className="text-muted">View your assignment grades and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Graded Assignments', value: grades.length,
            color: '#1a237e', icon: 'bi-clipboard-check-fill' },
          { label: 'Average Score', value: `${avg}%`,
            color: avg >= 70 ? '#2e7d32' : '#c62828',
            icon: 'bi-graph-up-arrow' },
          { label: 'Highest Score',
            value: grades.length
              ? Math.max(...grades.map(g => g.score)) + '%' : 'N/A',
            color: '#2e7d32', icon: 'bi-trophy-fill' }
        ].map(s => (
          <div key={s.label} className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div className="rounded-3 p-3"
                  style={{ background: `${s.color}20` }}>
                  <i className={`bi ${s.icon} fs-4`}
                    style={{ color: s.color }}></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small">{s.label}</p>
                  <h3 className="fw-bold mb-0"
                    style={{ color: s.color }}>{s.value}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grades Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="fw-bold mb-0">Grade Details</h5>
        </div>
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Assignment</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Feedback</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      <i className="bi bi-clipboard-x fs-2 d-block mb-2"></i>
                      No grades yet
                    </td>
                  </tr>
                ) : (
                  grades.map(g => {
                    const { label, color } = getGradeLabel(
                      g.score, g.assignment?.maxScore);
                    return (
                      <tr key={g.id}>
                        <td className="fw-semibold">
                          {g.assignment?.title}
                        </td>
                        <td className="text-muted small">
                          {g.assignment?.course?.title}
                        </td>
                        <td>
                          <span className="fw-bold">{g.score}</span>
                          <span className="text-muted">
                            /{g.assignment?.maxScore}
                          </span>
                        </td>
                        <td>
                          <span className="badge fs-6 rounded-3 px-3"
                            style={{ background: `${color}20`, color }}>
                            {label}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {g.feedback || '-'}
                        </td>
                        <td className="small text-muted">
                          {g.gradedAt
                            ? new Date(g.gradedAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGrades;
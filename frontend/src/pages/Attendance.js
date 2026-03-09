/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { attendanceAPI, courseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [courseStudents, setCourseStudents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, isTeacher, isAdmin, isStudent } = useAuth();
  const { cardBg, text, textMuted, border, inputBg, isDark } = useTheme();

  const cardStyle = {
    backgroundColor: cardBg, color: text, border: `1px solid ${border}`
  };

  // Load courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res;
        if (isAdmin()) res = await courseAPI.getAll();
        else if (isTeacher()) res = await courseAPI.getByTeacher(user.userId);
        else res = await courseAPI.getByStudent(user.userId);
        const data = res?.data?.data || [];
        setCourses(data);
        if (data.length > 0) setSelectedCourse(String(data[0].id));
      } catch (e) { console.error(e); }
    };
    fetchCourses();
  }, []);

  // Load attendance when course or date changes
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        if (isStudent()) {
          const [att, sum] = await Promise.all([
            attendanceAPI.getStudentAttendance(user.userId, selectedCourse),
            attendanceAPI.getSummary(user.userId, selectedCourse)
          ]);
          setAttendanceList(att?.data?.data || []);
          setSummary(sum?.data?.data);
        } else {
          // For teacher/admin: get students in course + existing attendance
          const courseRes = await courseAPI.getById(selectedCourse);
          const courseData = courseRes?.data?.data;
          const students = courseData?.students || [];
          setCourseStudents(students);

          const attRes = await attendanceAPI
            .getByCourseAndDate(selectedCourse, selectedDate);
          const existing = attRes?.data?.data || [];

          // Merge: show all students, fill in existing attendance status
          const merged = students.map(student => {
            const found = existing.find(a => a.student?.id === student.id);
            return {
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              username: student.username,
              status: found?.status || 'PRESENT',
              remarks: found?.remarks || '',
              saved: !!found
            };
          });
          setAttendanceList(merged);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAttendance();
  }, [selectedCourse, selectedDate]);

  // Update status locally before saving
  const updateStatus = (studentId, status) => {
    setAttendanceList(prev => prev.map(a =>
      a.studentId === studentId ? { ...a, status } : a
    ));
  };

  // Save all attendance at once
  const saveAllAttendance = async () => {
    setSaving(true);
    try {
      for (const a of attendanceList) {
        await attendanceAPI.mark({
          studentId: a.studentId,
          courseId: selectedCourse,
          date: selectedDate,
          status: a.status,
          remarks: a.remarks || ''
        });
      }
      alert('✅ Attendance saved successfully!');
      // Reload
      const attRes = await attendanceAPI
        .getByCourseAndDate(selectedCourse, selectedDate);
      const existing = attRes?.data?.data || [];
      setAttendanceList(prev => prev.map(a => {
        const found = existing.find(e => e.student?.id === a.studentId);
        return { ...a, saved: !!found };
      }));
    } catch (e) {
      alert('Error saving attendance');
    } finally { setSaving(false); }
  };

  const statusColors = {
    PRESENT: '#2e7d32', ABSENT: '#c62828',
    LATE: '#e65100', EXCUSED: '#1565c0'
  };

  const statusBg = {
    PRESENT: '#e8f5e9', ABSENT: '#ffebee',
    LATE: '#fff3e0', EXCUSED: '#e3f2fd'
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: text }}>
          Attendance Management
        </h4>
        <p style={{ color: textMuted }}>
          Track and manage student attendance records
        </p>
      </div>

      {/* Summary cards for students */}
      {isStudent() && summary && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Present', value: summary.present,
              color: '#2e7d32', icon: 'bi-check-circle-fill' },
            { label: 'Total Classes', value: summary.total,
              color: '#1a237e', icon: 'bi-calendar-fill' },
            { label: 'Percentage',
              value: `${summary.percentage}%`,
              color: Number(summary.percentage) >= 75
                ? '#2e7d32' : '#c62828',
              icon: 'bi-graph-up' }
          ].map(s => (
            <div key={s.label} className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4"
                style={cardStyle}>
                <div className="card-body p-4 d-flex align-items-center gap-3">
                  <div className="rounded-3 p-3"
                    style={{ background: `${s.color}20` }}>
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
            </div>
          ))}
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4" style={cardStyle}>
        <div className="card-body p-4">

          {/* Filters */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-semibold"
                style={{ color: text }}>
                Select Course
              </label>
              <select className="form-select"
                style={{ backgroundColor: inputBg, color: text,
                  borderColor: border }}
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}>
                <option value="">-- Select a course --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.courseCode})
                  </option>
                ))}
              </select>
            </div>
            {!isStudent() && (
              <div className="col-md-3">
                <label className="form-label fw-semibold"
                  style={{ color: text }}>Date</label>
                <input type="date" className="form-control"
                  style={{ backgroundColor: inputBg, color: text,
                    borderColor: border }}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)} />
              </div>
            )}
            {!isStudent() && attendanceList.length > 0 && (
              <div className="col-md-4">
                <button className="btn text-white fw-semibold w-100 rounded-3"
                  style={{ background: '#1a237e' }}
                  onClick={saveAllAttendance}
                  disabled={saving}>
                  {saving
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                    : <><i className="bi bi-save me-2"></i>Save Attendance</>}
                </button>
              </div>
            )}
          </div>

          {/* No course selected */}
          {!selectedCourse && (
            <div className="text-center py-5" style={{ color: textMuted }}>
              <i className="bi bi-calendar-check fs-1 d-block mb-3"></i>
              <h5>Select a course to manage attendance</h5>
            </div>
          )}

          {/* Loading */}
          {loading && selectedCourse && (
            <div className="text-center py-4">
              <div className="spinner-border"
                style={{ color: '#1a237e' }}></div>
            </div>
          )}

          {/* Attendance Table for Teacher/Admin */}
          {!loading && !isStudent() && selectedCourse && (
            <>
              {attendanceList.length === 0 ? (
                <div className="text-center py-5" style={{ color: textMuted }}>
                  <i className="bi bi-people fs-1 d-block mb-3"></i>
                  <h5>No students enrolled in this course</h5>
                  <p>Students need to enroll in this course first.</p>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
                    <p className="mb-0 fw-semibold" style={{ color: text }}>
                      {attendanceList.length} students •{' '}
                      {selectedDate}
                    </p>
                    <div className="d-flex gap-2">
                      {/* Quick mark all buttons */}
                      {['PRESENT', 'ABSENT'].map(s => (
                        <button key={s}
                          className="btn btn-sm rounded-3"
                          style={{
                            background: statusBg[s],
                            color: statusColors[s],
                            border: `1px solid ${statusColors[s]}`
                          }}
                          onClick={() => setAttendanceList(prev =>
                            prev.map(a => ({ ...a, status: s })))}>
                          All {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle"
                      style={{ color: text }}>
                      <thead>
                        <tr style={{ borderColor: border }}>
                          <th style={{ color: textMuted, fontWeight: 600 }}>
                            #
                          </th>
                          <th style={{ color: textMuted, fontWeight: 600 }}>
                            Student
                          </th>
                          <th style={{ color: textMuted, fontWeight: 600 }}>
                            Status
                          </th>
                          <th style={{ color: textMuted, fontWeight: 600 }}>
                            Quick Mark
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceList.map((a, idx) => (
                          <tr key={a.studentId}
                            style={{ borderColor: border }}>
                            <td style={{ color: textMuted }}>{idx + 1}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                  style={{
                                    width: 38, height: 38,
                                    background: '#1a237e',
                                    fontSize: '0.85rem', flexShrink: 0
                                  }}>
                                  {a.studentName?.split(' ')
                                    .map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="mb-0 fw-semibold"
                                    style={{ color: text }}>
                                    {a.studentName}
                                  </p>
                                  <small style={{ color: textMuted }}>
                                    @{a.username}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge rounded-pill px-3 py-2"
                                style={{
                                  background: statusBg[a.status],
                                  color: statusColors[a.status]
                                }}>
                                {a.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-1 flex-wrap">
                                {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']
                                  .map(s => (
                                  <button key={s}
                                    className="btn btn-sm rounded-3 fw-semibold"
                                    style={{
                                      fontSize: '0.72rem',
                                      padding: '3px 10px',
                                      background: a.status === s
                                        ? statusColors[s] : 'transparent',
                                      color: a.status === s
                                        ? 'white' : statusColors[s],
                                      border: `1px solid ${statusColors[s]}`
                                    }}
                                    onClick={() =>
                                      updateStatus(a.studentId, s)}>
                                    {s[0]}{s.slice(1).toLowerCase()}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-end">
                    <button
                      className="btn text-white fw-semibold rounded-3 px-5"
                      style={{ background: '#1a237e' }}
                      onClick={saveAllAttendance}
                      disabled={saving}>
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                        : <><i className="bi bi-save2 me-2"></i>Save All Attendance</>}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Attendance Table for Students */}
          {!loading && isStudent() && selectedCourse && (
            <div className="table-responsive">
              <table className="table align-middle" style={{ color: text }}>
                <thead>
                  <tr style={{ borderColor: border }}>
                    <th style={{ color: textMuted }}>Date</th>
                    <th style={{ color: textMuted }}>Status</th>
                    <th style={{ color: textMuted }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.length === 0 ? (
                    <tr>
                      <td colSpan={3}
                        className="text-center py-4"
                        style={{ color: textMuted }}>
                        <i className="bi bi-calendar-x fs-2 d-block mb-2"></i>
                        No attendance records yet
                      </td>
                    </tr>
                  ) : attendanceList.map(a => (
                    <tr key={a.id} style={{ borderColor: border }}>
                      <td style={{ color: text }}>{a.date}</td>
                      <td>
                        <span className="badge rounded-pill px-3"
                          style={{
                            background: statusBg[a.status],
                            color: statusColors[a.status]
                          }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ color: textMuted }}>
                        {a.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
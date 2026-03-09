package com.cms.service;

import com.cms.model.*;
import com.cms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public List<Attendance> getAttendanceForCourseOnDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndDate(courseId, date);
    }

    public List<Attendance> getStudentAttendance(Long studentId, Long courseId) {
        return attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    public Attendance markAttendance(Long studentId, Long courseId,
                                     LocalDate date,
                                     Attendance.AttendanceStatus status,
                                     String remarks) {
        Attendance attendance = attendanceRepository
                .findByStudentIdAndCourseIdAndDate(studentId, courseId, date)
                .orElse(new Attendance());

        if (attendance.getStudent() == null) {
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            attendance.setStudent(student);
            attendance.setCourse(course);
            attendance.setDate(date);
        }
        attendance.setStatus(status);
        attendance.setRemarks(remarks);
        return attendanceRepository.save(attendance);
    }

    public Map<String, Object> getAttendanceSummary(Long studentId, Long courseId) {
        Long present = attendanceRepository.countPresentByStudentAndCourse(studentId, courseId);
        Long total = attendanceRepository.countTotalByStudentAndCourse(studentId, courseId);
        double percentage = total > 0 ? (double) present / total * 100 : 0;
        return Map.of("present", present, "total", total,
                "percentage", Math.round(percentage * 100.0) / 100.0);
    }
}
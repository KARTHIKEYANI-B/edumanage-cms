package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.model.Attendance;
import com.cms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getCourseAttendance(
            @PathVariable Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(
            attendanceService.getAttendanceForCourseOnDate(courseId, date),
            "Fetched"));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getStudentAttendance(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(
            attendanceService.getStudentAttendance(studentId, courseId),
            "Fetched"));
    }

    @GetMapping("/student/{studentId}/course/{courseId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(
            attendanceService.getAttendanceSummary(studentId, courseId),
            "Fetched"));
    }

    @PostMapping("/mark")
    public ResponseEntity<ApiResponse<Attendance>> markAttendance(
            @RequestBody Map<String, Object> body) {
        Long studentId = Long.valueOf(body.get("studentId").toString());
        Long courseId = Long.valueOf(body.get("courseId").toString());
        LocalDate date = LocalDate.parse(body.get("date").toString());
        Attendance.AttendanceStatus status =
            Attendance.AttendanceStatus.valueOf(body.get("status").toString());
        String remarks = (String) body.getOrDefault("remarks", "");
        return ResponseEntity.ok(ApiResponse.success(
            attendanceService.markAttendance(
                studentId, courseId, date, status, remarks),
            "Marked"));
    }

    // ← New endpoint: mark attendance for whole class at once
    @PostMapping("/mark-all")
    public ResponseEntity<ApiResponse<String>> markAll(
            @RequestBody Map<String, Object> body) {
        Long courseId = Long.valueOf(body.get("courseId").toString());
        LocalDate date = LocalDate.parse(body.get("date").toString());
        String status = body.get("status").toString();

        @SuppressWarnings("unchecked")
        List<Long> studentIds = (List<Long>) body.get("studentIds");

        for (Object id : studentIds) {
            Long studentId = Long.valueOf(id.toString());
            attendanceService.markAttendance(
                studentId, courseId, date,
                Attendance.AttendanceStatus.valueOf(status), "");
        }
        return ResponseEntity.ok(
            ApiResponse.success("Done", "Attendance marked for all"));
    }
}
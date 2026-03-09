package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.model.*;
import com.cms.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> getAssignments(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByCourse(courseId), "Fetched"));
    }

    @PostMapping("/courses/{courseId}/assignments")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(
            @PathVariable Long courseId, @RequestBody Assignment assignment) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.createAssignment(courseId, assignment), "Created"));
    }

    @PutMapping("/assignments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Assignment>> updateAssignment(
            @PathVariable Long id, @RequestBody Assignment assignment) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.updateAssignment(id, assignment), "Updated"));
    }

    @DeleteMapping("/assignments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted"));
    }

    @PostMapping("/assignments/{assignmentId}/grade/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Grade>> gradeStudent(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId,
            @RequestBody Map<String, Object> body) {
        Double score = Double.valueOf(body.get("score").toString());
        String feedback = (String) body.getOrDefault("feedback", "");
        return ResponseEntity.ok(ApiResponse.success(
                assignmentService.gradeStudent(assignmentId, studentId, score, feedback), "Graded"));
    }

    @GetMapping("/grades/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Grade>>> getStudentGrades(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getGradesByStudent(studentId), "Fetched"));
    }

    @GetMapping("/assignments/{assignmentId}/grades")
    public ResponseEntity<ApiResponse<List<Grade>>> getAssignmentGrades(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getGradesByAssignment(assignmentId), "Fetched"));
    }
}
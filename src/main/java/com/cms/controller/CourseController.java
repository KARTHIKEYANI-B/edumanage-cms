package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.model.Course;
import com.cms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        return ResponseEntity.ok(
            ApiResponse.success(courseService.getAllCourses(), "Courses fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> getCourse(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(courseService.getCourseById(id), "Course fetched"));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesByTeacher(
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(
            ApiResponse.success(
                courseService.getCoursesByTeacher(teacherId), "Courses fetched"));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Course>>> getCoursesByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(
            ApiResponse.success(
                courseService.getCoursesByStudent(studentId), "Courses fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> createCourse(
            @RequestBody Course course) {
        return ResponseEntity.ok(
            ApiResponse.success(courseService.createCourse(course), "Course created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> updateCourse(
            @PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(
            ApiResponse.success(courseService.updateCourse(id, course), "Course updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Course deleted"));
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<ApiResponse<String>> enrollStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        courseService.enrollStudent(courseId, studentId);
        return ResponseEntity.ok(
            ApiResponse.success("Enrolled successfully", "Student enrolled"));
    }

    @DeleteMapping("/{courseId}/unenroll/{studentId}")
    public ResponseEntity<ApiResponse<String>> unenrollStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        courseService.unenrollStudent(courseId, studentId);
        return ResponseEntity.ok(
            ApiResponse.success("Unenrolled", "Student unenrolled"));
    }
}
package com.cms.service;

import com.cms.model.*;
import com.cms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final GradeRepository gradeRepository;

    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    public Assignment getById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    public Assignment createAssignment(Long courseId, Assignment assignment) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        assignment.setCourse(course);
        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(Long id, Assignment updated) {
        Assignment assignment = getById(id);
        assignment.setTitle(updated.getTitle());
        assignment.setDescription(updated.getDescription());
        assignment.setDueDate(updated.getDueDate());
        assignment.setMaxScore(updated.getMaxScore());
        assignment.setType(updated.getType());
        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }

    public Grade gradeStudent(Long assignmentId, Long studentId, Double score, String feedback) {
        Assignment assignment = getById(assignmentId);
        Grade grade = gradeRepository
                .findByStudentIdAndAssignmentId(studentId, assignmentId)
                .orElse(new Grade());
        grade.setAssignment(assignment);
        grade.setScore(score);
        grade.setFeedback(feedback);
        if (grade.getStudent() == null) {
            User student = new User();
            student.setId(studentId);
            grade.setStudent(student);
        }
        return gradeRepository.save(grade);
    }

    public List<Grade> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }

    public List<Grade> getGradesByAssignment(Long assignmentId) {
        return gradeRepository.findByAssignmentId(assignmentId);
    }
}
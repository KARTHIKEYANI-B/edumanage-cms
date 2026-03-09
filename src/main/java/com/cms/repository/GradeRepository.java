package com.cms.repository;

import com.cms.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByAssignmentId(Long assignmentId);
    Optional<Grade> findByStudentIdAndAssignmentId(Long studentId, Long assignmentId);

    @Query("SELECT AVG(g.score) FROM Grade g WHERE g.assignment.course.id = :courseId AND g.student.id = :studentId")
    Double getAverageScoreForStudentInCourse(Long courseId, Long studentId);
}
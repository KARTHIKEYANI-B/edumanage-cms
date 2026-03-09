package com.cms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String courseCode;

    @Column(length = 1000)
    private String description;

    private String category;
    private int credits;
    private String semester;
    private LocalDate startDate;
    private LocalDate endDate;
    private int maxStudents;

    // ← This stops infinite JSON loop
    @JsonIgnoreProperties({"password", "courses", "hibernateLazyInitializer"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    // ← This stops infinite JSON loop for students
    @JsonIgnoreProperties({"password", "courses", "hibernateLazyInitializer"})
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "course_enrollments",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<User> students = new HashSet<>();

    private boolean active = true;
}
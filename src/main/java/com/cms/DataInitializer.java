package com.cms;

import com.cms.model.*;
import com.cms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CourseRepository courseRepository;
    private final NoticeRepository noticeRepository;
    private final AssignmentRepository assignmentRepository;

    @Override
    public void run(String... args) {

        // ── USERS ──────────────────────────────────────────
        User admin = null;
        if (!userRepository.existsByUsername("admin")) {
            admin = userRepository.save(User.builder()
                .username("admin").email("admin@cms.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("System").lastName("Admin")
                .role(User.Role.ADMIN).active(true).build());
            System.out.println("✅ Admin created");
        } else {
            admin = userRepository.findByUsername("admin").get();
        }

        User teacher = null;
        if (!userRepository.existsByUsername("jsmith")) {
            teacher = userRepository.save(User.builder()
                .username("jsmith").email("jsmith@cms.com")
                .password(passwordEncoder.encode("teacher123"))
                .firstName("John").lastName("Smith")
                .role(User.Role.TEACHER).active(true).build());
            System.out.println("✅ Teacher created");
        } else {
            teacher = userRepository.findByUsername("jsmith").get();
        }

        User student = null;
        if (!userRepository.existsByUsername("alice")) {
            student = userRepository.save(User.builder()
                .username("alice").email("alice@cms.com")
                .password(passwordEncoder.encode("student123"))
                .firstName("Alice").lastName("Johnson")
                .role(User.Role.STUDENT).active(true).build());
            System.out.println("✅ Student created");
        } else {
            student = userRepository.findByUsername("alice").get();
        }

        // ── COURSES ────────────────────────────────────────
        if (courseRepository.count() == 0) {

            Course c1 = courseRepository.save(Course.builder()
                .title("Introduction to Java Programming")
                .courseCode("CS101")
                .description("Learn Java basics including OOP, data structures and algorithms.")
                .category("Computer Science")
                .credits(4).semester("Spring 2024")
                .startDate(LocalDate.of(2024, 1, 15))
                .endDate(LocalDate.of(2024, 5, 15))
                .maxStudents(40).teacher(teacher).active(true)
                .build());

            Course c2 = courseRepository.save(Course.builder()
                .title("Web Development with React")
                .courseCode("CS201")
                .description("Modern frontend development using React, hooks and REST APIs.")
                .category("Computer Science")
                .credits(3).semester("Spring 2024")
                .startDate(LocalDate.of(2024, 1, 15))
                .endDate(LocalDate.of(2024, 5, 15))
                .maxStudents(35).teacher(teacher).active(true)
                .build());

            Course c3 = courseRepository.save(Course.builder()
                .title("Database Management Systems")
                .courseCode("CS301")
                .description("SQL, normalization, transactions and database design principles.")
                .category("Computer Science")
                .credits(3).semester("Spring 2024")
                .startDate(LocalDate.of(2024, 1, 15))
                .endDate(LocalDate.of(2024, 5, 15))
                .maxStudents(45).teacher(teacher).active(true)
                .build());

            Course c4 = courseRepository.save(Course.builder()
                .title("Calculus and Linear Algebra")
                .courseCode("MATH101")
                .description("Differential calculus, integration and matrix operations.")
                .category("Mathematics")
                .credits(4).semester("Spring 2024")
                .startDate(LocalDate.of(2024, 1, 15))
                .endDate(LocalDate.of(2024, 5, 15))
                .maxStudents(50).teacher(teacher).active(true)
                .build());

            Course c5 = courseRepository.save(Course.builder()
                .title("Physics for Engineers")
                .courseCode("PHY101")
                .description("Mechanics, thermodynamics and electromagnetism fundamentals.")
                .category("Physics")
                .credits(3).semester("Spring 2024")
                .startDate(LocalDate.of(2024, 1, 15))
                .endDate(LocalDate.of(2024, 5, 15))
                .maxStudents(40).teacher(teacher).active(true)
                .build());

            // Enroll alice in all courses
            c1.getStudents().add(student);
            c2.getStudents().add(student);
            c3.getStudents().add(student);
            courseRepository.save(c1);
            courseRepository.save(c2);
            courseRepository.save(c3);

            // ── ASSIGNMENTS ────────────────────────────────
            assignmentRepository.save(Assignment.builder()
                .title("Java Basics Quiz")
                .description("Quiz covering variables, loops, and OOP concepts.")
                .dueDate(LocalDateTime.of(2024, 2, 20, 23, 59))
                .maxScore(100.0).type(Assignment.AssignmentType.QUIZ)
                .course(c1).build());

            assignmentRepository.save(Assignment.builder()
                .title("OOP Project")
                .description("Build a simple library management system using Java OOP.")
                .dueDate(LocalDateTime.of(2024, 3, 15, 23, 59))
                .maxScore(100.0).type(Assignment.AssignmentType.PROJECT)
                .course(c1).build());

            assignmentRepository.save(Assignment.builder()
                .title("React Todo App")
                .description("Build a todo application using React hooks and state management.")
                .dueDate(LocalDateTime.of(2024, 2, 28, 23, 59))
                .maxScore(100.0).type(Assignment.AssignmentType.PROJECT)
                .course(c2).build());

            assignmentRepository.save(Assignment.builder()
                .title("SQL Assignment 1")
                .description("Write queries for SELECT, JOIN, GROUP BY operations.")
                .dueDate(LocalDateTime.of(2024, 2, 25, 23, 59))
                .maxScore(50.0).type(Assignment.AssignmentType.HOMEWORK)
                .course(c3).build());

            assignmentRepository.save(Assignment.builder()
                .title("Midterm Exam")
                .description("Covers all topics from weeks 1-7.")
                .dueDate(LocalDateTime.of(2024, 3, 10, 10, 0))
                .maxScore(100.0).type(Assignment.AssignmentType.EXAM)
                .course(c1).build());

            System.out.println("✅ Courses and assignments created");
        }

        // ── NOTICES ────────────────────────────────────────
        if (noticeRepository.count() == 0) {
            noticeRepository.save(Notice.builder()
                .title("Welcome to Spring 2024 Semester!")
                .content("Dear students, welcome to the new semester. Please check your course schedules and ensure you are enrolled in all required courses. Office hours start from next week.")
                .type(Notice.NoticeType.GENERAL)
                .author(admin).pinned(true).build());

            noticeRepository.save(Notice.builder()
                .title("Exam Schedule Released")
                .content("The midterm exam schedule has been released. Please check the academic calendar for your exam dates and times. All exams will be held in the main examination hall.")
                .type(Notice.NoticeType.EXAM)
                .author(admin).pinned(true).build());

            noticeRepository.save(Notice.builder()
                .title("Library Hours Extended")
                .content("The library will now be open until 10 PM on weekdays during the exam period. Students can access all digital resources 24/7 through the online portal.")
                .type(Notice.NoticeType.GENERAL)
                .author(admin).pinned(false).build());

            noticeRepository.save(Notice.builder()
                .title("Annual Tech Fest 2024")
                .content("Register now for Annual Tech Fest! Exciting competitions in coding, robotics and AI. Winners get exciting prizes. Last date to register is February 28th.")
                .type(Notice.NoticeType.EVENT)
                .author(admin).pinned(false).build());

            System.out.println("✅ Notices created");
        }
    }
}
package com.cms.course_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.cms")
@EntityScan(basePackages = "com.cms.model")
@EnableJpaRepositories(basePackages = "com.cms.repository")
public class CourseManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(
            CourseManagementSystemApplication.class, args);
    }
}
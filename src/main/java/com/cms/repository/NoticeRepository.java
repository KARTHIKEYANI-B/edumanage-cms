package com.cms.repository;

import com.cms.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    List<Notice> findByCourseIsNullOrderByCreatedAtDesc();
    List<Notice> findByPinnedTrueOrderByCreatedAtDesc();
}
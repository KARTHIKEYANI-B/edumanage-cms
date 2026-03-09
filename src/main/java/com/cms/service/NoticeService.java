package com.cms.service;

import com.cms.model.*;
import com.cms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<Notice> getGeneralNotices() {
        return noticeRepository.findByCourseIsNullOrderByCreatedAtDesc();
    }

    public List<Notice> getNoticesByCourse(Long courseId) {
        return noticeRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }

    public List<Notice> getPinnedNotices() {
        return noticeRepository.findByPinnedTrueOrderByCreatedAtDesc();
    }

    public Notice createNotice(Notice notice, Long authorId, Long courseId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        notice.setAuthor(author);
        if (courseId != null) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            notice.setCourse(course);
        }
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, Notice updated) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        notice.setTitle(updated.getTitle());
        notice.setContent(updated.getContent());
        notice.setType(updated.getType());
        notice.setPinned(updated.isPinned());
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}

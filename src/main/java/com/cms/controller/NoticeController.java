package com.cms.controller;

import com.cms.dto.ApiResponse;
import com.cms.model.Notice;
import com.cms.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/general")
    public ResponseEntity<ApiResponse<List<Notice>>> getGeneralNotices() {
        return ResponseEntity.ok(ApiResponse.success(noticeService.getGeneralNotices(), "Fetched"));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<Notice>>> getCourseNotices(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(noticeService.getNoticesByCourse(courseId), "Fetched"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Notice>> createNotice(
            @RequestBody Notice notice,
            @RequestParam Long authorId,
            @RequestParam(required = false) Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(
                noticeService.createNotice(notice, authorId, courseId), "Created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Notice>> updateNotice(
            @PathVariable Long id, @RequestBody Notice notice) {
        return ResponseEntity.ok(ApiResponse.success(noticeService.updateNotice(id, notice), "Updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted"));
    }
}
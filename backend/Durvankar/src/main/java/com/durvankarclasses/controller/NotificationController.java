package com.durvankarclasses.controller;

import com.durvankarclasses.model.Notification;
import com.durvankarclasses.model.Student;
import com.durvankarclasses.repository.NotificationRepository;
import com.durvankarclasses.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final StudentService studentService;

    /** Parent/Student: get absence/other notifications for their student */
    @GetMapping("/absence")
    public ResponseEntity<List<Notification>> getAbsenceNotifications(
            @AuthenticationPrincipal UserDetails u) {
        try {
            Student student = studentService.getByUserId(u.getUsername());
            return ResponseEntity.ok(notificationRepository.findByStudentId(student.getId()));
        } catch (Exception e) {
            // may be parent - get by parentId via linked student
            return ResponseEntity.ok(List.of());
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(@PathVariable String id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
        notif.setRead(true);
        return ResponseEntity.ok(notificationRepository.save(notif));
    }
}

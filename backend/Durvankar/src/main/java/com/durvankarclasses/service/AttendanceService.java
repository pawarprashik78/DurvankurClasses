package com.durvankarclasses.service;

import com.durvankarclasses.dto.request.AttendanceRequest;
import com.durvankarclasses.model.*;
import com.durvankarclasses.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final NotificationRepository notificationRepository;
    private final StudentService studentService;
    private final EmailService emailService;

    public List<Attendance> getAll() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getByStudentId(String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getWeekly(String studentId) {
        return attendanceRepository.findByStudentId(studentId)
                .stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(7)
                .toList();
    }

    public Attendance mark(AttendanceRequest req, String teacherId) {
        if (attendanceRepository.findByStudentIdAndDate(req.getStudentId(), req.getDate()).isPresent()) {
            throw new RuntimeException("Attendance already marked for this student on " + req.getDate());
        }

        Attendance attendance = Attendance.builder()
                .studentId(req.getStudentId())
                .teacherId(teacherId)
                .date(req.getDate())
                .status(req.getStatus())
                .remarks(req.getRemarks())
                .createdAt(LocalDateTime.now())
                .build();

        attendance = attendanceRepository.save(attendance);

        if ("absent".equalsIgnoreCase(req.getStatus())) {
            triggerAbsenceFlow(req.getStudentId(), req.getDate());
        }

        return attendance;
    }

    private void triggerAbsenceFlow(String studentId, String date) {
        try {
            Student student = studentService.getById(studentId);
            String msg = student.getName() + " was absent on " + date + ". Please ensure timely attendance.";

            // Save in-app notification
            Notification notif = Notification.builder()
                    .studentId(studentId)
                    .parentId(student.getParentId())
                    .type("absence")
                    .message(msg)
                    .date(date)
                    .isRead(false)
                    .sentAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notif);

            // Send email to parent
            if (student.getParentId() != null) {
                parentRepository.findById(student.getParentId()).ifPresent(parent -> {
                    if (parent.getEmail() != null && !parent.getEmail().isBlank()) {
                        String parentName = parent.getName() != null ? parent.getName() : "Parent";
                        emailService.sendAbsenceAlert(parent.getEmail(), parentName, student.getName(), date);
                    }
                });
            }
        } catch (Exception e) {
            log.warn("Attendance notification flow failed: {}", e.getMessage());
        }
    }

    public List<Attendance> getByDateRange(String studentId, String startDate, String endDate) {
        return attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate);
    }
}

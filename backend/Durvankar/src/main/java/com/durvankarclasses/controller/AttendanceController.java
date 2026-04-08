package com.durvankarclasses.controller;

import com.durvankarclasses.dto.request.AttendanceRequest;
import com.durvankarclasses.model.*;
import com.durvankarclasses.repository.*;
import com.durvankarclasses.service.AttendanceService;
import com.durvankarclasses.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final StudentService studentService;
    private final TeacherRepository teacherRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;

    /**
     * GET /api/attendance
     * - Admin/Teacher: all records
     * - Student: own attendance only
     * - Parent: attendance of all linked students
     */
    @GetMapping
    public ResponseEntity<List<Attendance>> getAll(@AuthenticationPrincipal UserDetails u) {
        var userOpt = userRepository.findById(u.getUsername());  // username = userId
        if (userOpt.isEmpty()) return ResponseEntity.ok(attendanceService.getAll());

        String role     = userOpt.get().getRole();
        String linkedId = userOpt.get().getLinkedId();

        return switch (role) {
            case "student" -> ResponseEntity.ok(attendanceService.getByStudentId(linkedId));
            case "parent"  -> {
                var parent = parentRepository.findById(linkedId);
                if (parent.isEmpty() || parent.get().getStudentIds() == null)
                    yield ResponseEntity.ok(List.of());
                List<Attendance> all = new ArrayList<>();
                for (String sid : parent.get().getStudentIds())
                    all.addAll(attendanceService.getByStudentId(sid));
                yield ResponseEntity.ok(all);
            }
            default -> ResponseEntity.ok(attendanceService.getAll()); // admin | teacher
        };
    }

    /** Admin/Teacher: mark attendance */
    @PostMapping
    public ResponseEntity<Attendance> mark(@Valid @RequestBody AttendanceRequest req,
                                           @AuthenticationPrincipal UserDetails u) {
        Teacher teacher = teacherRepository.findByUserId(u.getUsername()).orElse(null);
        String teacherId = teacher != null ? teacher.getId() : null;
        return ResponseEntity.status(201).body(attendanceService.mark(req, teacherId));
    }

    /** Student/Parent: weekly attendance for logged-in student */
    @GetMapping("/weekly")
    public ResponseEntity<List<Attendance>> getWeekly(@AuthenticationPrincipal UserDetails u) {
        try {
            Student student = studentService.getByUserId(u.getUsername());
            return ResponseEntity.ok(attendanceService.getWeekly(student.getId()));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /** Student/Parent: date-range or full history for logged-in student */
    @GetMapping("/monthly")
    public ResponseEntity<List<Attendance>> getMonthly(
            @AuthenticationPrincipal UserDetails u,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            Student student = studentService.getByUserId(u.getUsername());
            if (startDate != null && endDate != null)
                return ResponseEntity.ok(attendanceService.getByDateRange(student.getId(), startDate, endDate));
            return ResponseEntity.ok(attendanceService.getByStudentId(student.getId()));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /** Stats for a specific student (Admin/Teacher use) */
    @GetMapping("/stats/{studentId}")
    public ResponseEntity<?> getStats(@PathVariable String studentId) {
        long total   = attendanceService.getByStudentId(studentId).size();
        long present = attendanceService.getByStudentId(studentId)
                .stream().filter(a -> "present".equals(a.getStatus())).count();
        long absent  = total - present;
        double pct   = total > 0 ? (present * 100.0 / total) : 0;
        return ResponseEntity.ok(java.util.Map.of(
                "total", total, "present", present,
                "absent", absent, "percentage", Math.round(pct)));
    }
}

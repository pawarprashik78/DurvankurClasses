package com.durvankarclasses.service;

import com.durvankarclasses.dto.response.StudentStatsResponse;
import com.durvankarclasses.model.*;
import com.durvankarclasses.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final FeeRepository feeRepository;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;

    public List<Student> getAll() {
        return studentRepository.findByIsActive(true);
    }

    public List<Student> getByStandard(String standard) {
        return studentRepository.findByStandard(standard);
    }

    public Student getById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }

    public Student getByUserId(String userId) {
        String studentId = getStudentIdForUser(userId);
        return getById(studentId);
    }

    public String getStudentIdForUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        if ("student".equalsIgnoreCase(user.getRole())) {
            return user.getLinkedId();
        } else if ("parent".equalsIgnoreCase(user.getRole())) {
            Parent parent = parentRepository.findById(user.getLinkedId())
                    .orElseThrow(() -> new RuntimeException("Parent profile not found"));
            if (parent.getStudentIds() == null || parent.getStudentIds().isEmpty()) {
                throw new RuntimeException("No student linked to this parent");
            }
            return parent.getStudentIds().get(0);
        }
        throw new RuntimeException("User is not a student or parent");
    }

    public Student update(String id, Student updated) {
        Student existing = getById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setStandard(updated.getStandard());
        existing.setAddress(updated.getAddress());
        return studentRepository.save(existing);
    }

    public void softDelete(String id) {
        Student s = getById(id);
        s.setActive(false);
        studentRepository.save(s);
    }

    public StudentStatsResponse getStats(String studentId) {
        Student student = getById(studentId);

        long total = attendanceRepository.countByStudentIdAndStatus(studentId, "present")
                   + attendanceRepository.countByStudentIdAndStatus(studentId, "absent")
                   + attendanceRepository.countByStudentIdAndStatus(studentId, "late");
        long present = attendanceRepository.countByStudentIdAndStatus(studentId, "present");
        double attendancePct = total > 0 ? (present * 100.0 / total) : 0;

        List<Marks> marksList = marksRepository.findByStudentId(studentId);
        double avgMarks = marksList.stream()
                .mapToDouble(m -> (m.getTotalMarks() > 0) ? (m.getMarksObtained() / m.getTotalMarks()) * 100 : 0)
                .average().orElse(0);

        List<Fee> pendingFees = feeRepository.findByStudentIdAndStatus(studentId, "pending");
        List<Fee> partialFees = feeRepository.findByStudentIdAndStatus(studentId, "partial");
        double pendingAmt = pendingFees.stream().mapToDouble(f -> f.getAmount() - f.getPaidAmount()).sum()
                + partialFees.stream().mapToDouble(f -> f.getAmount() - f.getPaidAmount()).sum();

        return StudentStatsResponse.builder()
                .studentId(studentId)
                .name(student.getName())
                .rollNumber(student.getRollNumber())
                .standard(student.getStandard())
                .attendancePercentage(Math.round(attendancePct * 10.0) / 10.0)
                .averageMarks(Math.round(avgMarks * 10.0) / 10.0)
                .pendingFees(pendingAmt)
                .build();
    }
}

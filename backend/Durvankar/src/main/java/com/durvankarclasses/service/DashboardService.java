package com.durvankarclasses.service;

import com.durvankarclasses.dto.response.DashboardStatsResponse;
import com.durvankarclasses.model.Fee;
import com.durvankarclasses.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final FeeRepository feeRepository;
    private final TestRepository testRepository;
    private final MessageRepository messageRepository;

    public DashboardStatsResponse getAdminStats() {
        long students = studentRepository.countByIsActive(true);
        long teachers = teacherRepository.countByIsActive(true);

        List<Fee> allFees = feeRepository.findAll();
        double totalBilled = allFees.stream().mapToDouble(Fee::getAmount).sum();
        double collected = allFees.stream().mapToDouble(Fee::getPaidAmount).sum();
        double pct = totalBilled > 0 ? (collected / totalBilled) * 100 : 0;
        long pendingFeeCnt = allFees.stream().filter(f -> "pending".equals(f.getStatus()) || "partial".equals(f.getStatus())).count();

        long upcomingTests = testRepository.findByStatus("upcoming").size();

        return DashboardStatsResponse.builder()
                .totalStudents(students)
                .totalTeachers(teachers)
                .totalFeesBilled(totalBilled)
                .totalFeesCollected(collected)
                .feeCollectionPercentage(Math.round(pct * 10.0) / 10.0)
                .pendingFeeCount(pendingFeeCnt)
                .upcomingTestCount(upcomingTests)
                .build();
    }
}

package com.durvankarclasses.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StudentStatsResponse {
    private String studentId;
    private String name;
    private String rollNumber;
    private String standard;
    private double attendancePercentage;
    private double averageMarks;
    private double pendingFees;
}

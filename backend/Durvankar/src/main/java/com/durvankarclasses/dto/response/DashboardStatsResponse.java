package com.durvankarclasses.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsResponse {
    private long totalStudents;
    private long totalTeachers;
    private double totalFeesBilled;
    private double totalFeesCollected;
    private double feeCollectionPercentage;
    private long pendingFeeCount;
    private long upcomingTestCount;
    private long unreadMessageCount;
}

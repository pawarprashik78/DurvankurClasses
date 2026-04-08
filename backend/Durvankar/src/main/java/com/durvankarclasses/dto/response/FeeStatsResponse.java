package com.durvankarclasses.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FeeStatsResponse {
    private String studentId;
    private String studentName;
    private double totalAmount;
    private double paidAmount;
    private double pendingAmount;
    private long paidMonths;
    private long pendingMonths;
}

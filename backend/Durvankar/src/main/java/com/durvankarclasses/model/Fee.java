package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "fees")
@CompoundIndex(name = "student_month_year_unique", def = "{'studentId': 1, 'month': 1, 'year': 1}", unique = true)
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Fee {

    @Id
    private String id;

    private String studentId;   // ref → students._id

    private String month;       // January … December
    private int year;

    private double amount;
    private double paidAmount;

    /** paid | pending | partial */
    private String status;

    /** yyyy-MM-dd */
    private String paymentDate;

    private String paymentMode;     // cash | online | cheque
    private String receiptNumber;
    private String remarks;

    private String createdBy;       // ref → users._id
    private LocalDateTime createdAt;
}

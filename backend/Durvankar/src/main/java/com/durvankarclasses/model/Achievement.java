package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "achievements")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Achievement {

    @Id
    private String id;

    private String name;
    private String studentId;   // ref → students._id (optional, for current students)
    private String batchYear;   // e.g. "2024-25"
    private double percentage;
    private int rank;
    private String grade;
    private String collegeAdmitted;
    private String photo;       // URL or null

    private LocalDateTime createdAt;
}

package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "attendance")
@CompoundIndex(name = "student_date_unique", def = "{'studentId': 1, 'date': 1}", unique = true)
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Attendance {

    @Id
    private String id;

    private String studentId;  // ref → students._id
    private String teacherId;  // ref → teachers._id

    /** yyyy-MM-dd */
    private String date;

    /** present | absent | late */
    private String status;

    private String remarks;

    private LocalDateTime createdAt;
}

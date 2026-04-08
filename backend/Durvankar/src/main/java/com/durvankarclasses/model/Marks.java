package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "marks")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Marks {

    @Id
    private String id;

    private String studentId;   // ref → students._id
    private String subjectId;   // e.g., MATH, ENG, SCI1
    private String subjectName; // denormalized e.g., Mathematics
    private String testId;      // ref → tests._id (optional)

    private String testName;

    /** tuition | school */
    private String testType;

    private double marksObtained;
    private double totalMarks;
    private String grade;       // A+, A, B+, B, C, D, F
    private String term;        // Term 1, Term 2

    /** yyyy-MM-dd */
    private String testDate;

    private String remarks;
    private String enteredBy;   // ref → users._id

    private LocalDateTime createdAt;
}

package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "tests")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Test {

    @Id
    private String id;

    private String name;
    private String subjectId;   // ref → subjects._id
    private String standard;

    private double totalMarks;

    /** yyyy-MM-dd */
    private String testDate;

    /** upcoming | completed | cancelled */
    private String status;

    private String createdBy;   // ref → users._id
    private LocalDateTime createdAt;
}

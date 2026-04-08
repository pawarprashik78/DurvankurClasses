package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "batches")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Batch {

    @Id
    private String id;

    private String name;
    private String standard;
    private String academicYear;
    private String teacherId;       // ref → teachers._id
    private List<String> subjectIds;
    private String timings;
    private List<String> daysOfWeek;

    private LocalDateTime createdAt;
}

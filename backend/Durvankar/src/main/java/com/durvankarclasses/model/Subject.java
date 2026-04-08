package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "subjects")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Subject {

    @Id
    private String id;

    private String name;
    private String code;
    private String standard;
    private String teacherId;  // ref → teachers._id

    private LocalDateTime createdAt;
}

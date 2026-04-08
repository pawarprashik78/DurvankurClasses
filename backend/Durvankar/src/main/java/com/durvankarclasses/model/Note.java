package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notes")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Note {

    @Id
    private String id;

    private String title;
    private String subjectId;   // ref → subjects.id (e.g., MATH, ENG)
    private String subjectName; // denormalized (e.g., Mathematics)
    private String standard;
    private String content;
    private String fileUrl;

    /** handwritten | video | ppt */
    private String type;

    private String uploadedBy;  // ref → teachers._id

    @Builder.Default
    private boolean isPublished = true;

    private LocalDateTime uploadedAt;
}

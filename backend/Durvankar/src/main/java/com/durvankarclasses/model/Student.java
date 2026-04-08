package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "students")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Student {

    @Id
    private String id;

    private String userId;   // ref → users._id

    private String name;
    private String email;
    private String phone;

    @Indexed
    private String standard;

    @Indexed(unique = true)
    private String rollNumber;

    private String dateOfBirth;
    private String address;

    private String parentId;  // ref → parents._id
    private String batchId;   // ref → batches._id

    @Builder.Default
    private boolean isActive = true;

    private LocalDateTime createdAt;
}

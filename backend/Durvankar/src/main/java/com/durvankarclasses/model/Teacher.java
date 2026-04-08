package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "teachers")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Teacher {

    @Id
    private String id;

    private String userId;  // ref → users._id

    private String name;

    @Indexed(unique = true)
    private String email;

    private String phone;
    private String specialization;    // e.g., Mathematics
    private String qualifications;    // e.g., M.Sc B.Ed
    private List<String> subjects;
    private int experience;

    @Builder.Default
    private boolean isActive = true;

    private LocalDateTime createdAt;
}

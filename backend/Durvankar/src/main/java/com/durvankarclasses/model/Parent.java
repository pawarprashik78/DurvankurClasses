package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "parents")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Parent {

    @Id
    private String id;

    private String userId;  // ref → users._id

    private String name;

    @Indexed(unique = true)
    private String email;

    private String phone;

    /** List of student IDs belonging to this parent */
    private List<String> studentIds;

    private LocalDateTime createdAt;
}

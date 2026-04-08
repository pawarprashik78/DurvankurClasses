package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Message {

    @Id
    private String id;

    private String senderId;        // ref → users._id
    private String senderType;      // admin | teacher | parent | student

    private String receiverId;      // ref → users._id
    private String receiverType;    // admin | teacher | parent | student

    private String subject;
    private String content;

    @Builder.Default
    private boolean isRead = false;

    private LocalDateTime readAt;

    private LocalDateTime createdAt;
}

package com.durvankarclasses.dto.request;

import lombok.Data;

@Data
public class MessageRequest {
    private String subject;
    private String content;
    private String senderType;   // admin | teacher
    private String receiverType; // all | student | parent | teacher
    // Optional: direct receiver ID (if not broadcasting)
    private String receiverId;
}

package com.durvankarclasses.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Notification {

    @Id
    private String id;

    private String studentId;   // ref → students._id
    private String parentId;    // ref → parents._id

    /** absence | fee_reminder | general */
    private String type;

    private String message;

    /** yyyy-MM-dd */
    private String date;

    @Builder.Default
    private boolean isRead = false;

    private LocalDateTime sentAt;
}

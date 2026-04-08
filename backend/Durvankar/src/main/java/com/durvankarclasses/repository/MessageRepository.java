package com.durvankarclasses.repository;

import com.durvankarclasses.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByReceiverIdOrderByCreatedAtDesc(String receiverId);
    List<Message> findBySenderIdOrderByCreatedAtDesc(String senderId);
    List<Message> findByReceiverIdAndIsRead(String receiverId, boolean isRead);
    long countByReceiverIdAndIsRead(String receiverId, boolean isRead);
}

package com.durvankarclasses.service;

import com.durvankarclasses.dto.request.MessageRequest;
import com.durvankarclasses.model.Message;
import com.durvankarclasses.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    /** Get all messages (for the logged-in user) */
    public List<Message> getAll() {
        return messageRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    public List<Message> getForUser(String userId) {
        return messageRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Send/broadcast a message.
     * Teacher/Admin can broadcast without a specific receiverId.
     */
    public Message send(MessageRequest req, String senderId, String senderType) {
        Message msg = Message.builder()
                .senderId(senderId)
                .senderType(req.getSenderType() != null ? req.getSenderType() : senderType)
                .receiverId(req.getReceiverId() != null ? req.getReceiverId() : "broadcast")
                .receiverType(req.getReceiverType() != null ? req.getReceiverType() : "all")
                .subject(req.getSubject())
                .content(req.getContent())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return messageRepository.save(msg);
    }

    public Message markRead(String id, String userId) {
        Message msg = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found: " + id));
        msg.setRead(true);
        msg.setReadAt(LocalDateTime.now());
        return messageRepository.save(msg);
    }

    public void delete(String id) { messageRepository.deleteById(id); }

    public long getUnreadCount(String userId) {
        return messageRepository.countByReceiverIdAndIsRead(userId, false);
    }
}

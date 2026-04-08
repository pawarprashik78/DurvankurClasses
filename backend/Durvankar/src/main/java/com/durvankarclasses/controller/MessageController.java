package com.durvankarclasses.controller;

import com.durvankarclasses.model.Message;
import com.durvankarclasses.dto.request.MessageRequest;
import com.durvankarclasses.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /** Get all messages (broadcast + personal) */
    @GetMapping
    public ResponseEntity<List<Message>> getAll() {
        return ResponseEntity.ok(messageService.getAll());
    }

    /** Get unread count for logged-in user */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(java.util.Map.of("count", messageService.getUnreadCount(u.getUsername())));
    }

    /** Teacher/Admin: post a broadcast/targeted message */
    @PostMapping
    public ResponseEntity<Message> send(@RequestBody MessageRequest req,
                                        @AuthenticationPrincipal UserDetails u) {
        String senderType = "teacher"; // default
        return ResponseEntity.status(201).body(messageService.send(req, u.getUsername(), senderType));
    }

    /** Mark a message read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Message> markRead(@PathVariable String id,
                                            @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(messageService.markRead(id, u.getUsername()));
    }

    /** Delete a message */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

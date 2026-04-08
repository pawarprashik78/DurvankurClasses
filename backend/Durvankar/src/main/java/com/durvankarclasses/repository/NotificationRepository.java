package com.durvankarclasses.repository;

import com.durvankarclasses.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByStudentId(String studentId);
    List<Notification> findByParentId(String parentId);
    List<Notification> findByParentIdAndIsRead(String parentId, boolean isRead);
    List<Notification> findByStudentIdAndIsRead(String studentId, boolean isRead);
}

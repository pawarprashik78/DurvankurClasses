package com.durvankarclasses.repository;

import com.durvankarclasses.model.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends MongoRepository<Teacher, String> {
    Optional<Teacher> findByEmail(String email);
    Optional<Teacher> findByUserId(String userId);
    List<Teacher> findByIsActive(boolean isActive);
    boolean existsByEmail(String email);
    long countByIsActive(boolean isActive);
}

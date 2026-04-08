package com.durvankarclasses.repository;

import com.durvankarclasses.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    List<Student> findByStandard(String standard);
    List<Student> findByIsActive(boolean isActive);
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByUserId(String userId);
    List<Student> findByParentId(String parentId);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByEmail(String email);
    long countByIsActive(boolean isActive);
}

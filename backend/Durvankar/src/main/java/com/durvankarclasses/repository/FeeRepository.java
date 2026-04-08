package com.durvankarclasses.repository;

import com.durvankarclasses.model.Fee;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FeeRepository extends MongoRepository<Fee, String> {
    List<Fee> findByStudentId(String studentId);
    List<Fee> findByStatus(String status);
    List<Fee> findByStudentIdAndStatus(String studentId, String status);
    Optional<Fee> findByStudentIdAndMonthAndYear(String studentId, String month, int year);
    boolean existsByStudentIdAndMonthAndYear(String studentId, String month, int year);
}

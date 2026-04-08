package com.durvankarclasses.repository;

import com.durvankarclasses.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByStudentIdAndDateBetween(String studentId, String startDate, String endDate);
    Optional<Attendance> findByStudentIdAndDate(String studentId, String date);
    List<Attendance> findByDate(String date);
    long countByStudentIdAndStatus(String studentId, String status);
    long countByStudentIdAndDateBetween(String studentId, String start, String end);
}

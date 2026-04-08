package com.durvankarclasses.repository;

import com.durvankarclasses.model.Marks;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MarksRepository extends MongoRepository<Marks, String> {
    List<Marks> findByStudentId(String studentId);
    List<Marks> findBySubjectId(String subjectId);
    List<Marks> findByStudentIdAndSubjectId(String studentId, String subjectId);
    List<Marks> findByTestId(String testId);
    List<Marks> findByStudentIdAndTestType(String studentId, String testType);
}

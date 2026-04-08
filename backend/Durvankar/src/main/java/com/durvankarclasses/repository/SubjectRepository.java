package com.durvankarclasses.repository;

import com.durvankarclasses.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    List<Subject> findByStandard(String standard);
    List<Subject> findByTeacherId(String teacherId);
}

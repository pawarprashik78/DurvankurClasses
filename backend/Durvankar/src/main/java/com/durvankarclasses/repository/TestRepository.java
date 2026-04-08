package com.durvankarclasses.repository;

import com.durvankarclasses.model.Test;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TestRepository extends MongoRepository<Test, String> {
    List<Test> findByStandard(String standard);
    List<Test> findByStatus(String status);
    List<Test> findByStandardAndStatus(String standard, String status);
    List<Test> findBySubjectId(String subjectId);
}

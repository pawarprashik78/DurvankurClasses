package com.durvankarclasses.repository;

import com.durvankarclasses.model.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BatchRepository extends MongoRepository<Batch, String> {
    List<Batch> findByStandard(String standard);
    List<Batch> findByTeacherId(String teacherId);
    List<Batch> findByAcademicYear(String academicYear);
}

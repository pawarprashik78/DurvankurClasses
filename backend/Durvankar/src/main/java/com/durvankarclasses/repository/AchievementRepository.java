package com.durvankarclasses.repository;

import com.durvankarclasses.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
    List<Achievement> findByBatchYearOrderByRankAsc(String batchYear);
    List<Achievement> findAllByOrderByBatchYearDescRankAsc();
}

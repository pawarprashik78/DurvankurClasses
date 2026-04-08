package com.durvankarclasses.repository;

import com.durvankarclasses.model.Parent;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ParentRepository extends MongoRepository<Parent, String> {
    Optional<Parent> findByEmail(String email);
    Optional<Parent> findByUserId(String userId);
    boolean existsByEmail(String email);
}

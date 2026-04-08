package com.durvankarclasses.repository;

import com.durvankarclasses.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NoteRepository extends MongoRepository<Note, String> {
    List<Note> findByStandard(String standard);
    List<Note> findBySubjectId(String subjectId);
    List<Note> findByType(String type);
    List<Note> findByStandardAndSubjectId(String standard, String subjectId);
    List<Note> findByIsPublished(boolean isPublished);
}

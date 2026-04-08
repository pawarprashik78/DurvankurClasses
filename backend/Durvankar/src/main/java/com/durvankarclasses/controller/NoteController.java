package com.durvankarclasses.controller;

import com.durvankarclasses.dto.request.NoteRequest;
import com.durvankarclasses.model.Note;
import com.durvankarclasses.repository.NoteRepository;
import com.durvankarclasses.repository.TeacherRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteRepository noteRepository;
    private final TeacherRepository teacherRepository;

    @GetMapping
    public ResponseEntity<List<Note>> getAll(
            @RequestParam(required = false) String subjectId,
            @RequestParam(required = false) String standard,
            @RequestParam(required = false) String type) {
        if (standard != null && subjectId != null)
            return ResponseEntity.ok(noteRepository.findByStandardAndSubjectId(standard, subjectId));
        if (standard != null) return ResponseEntity.ok(noteRepository.findByStandard(standard));
        if (subjectId != null) return ResponseEntity.ok(noteRepository.findBySubjectId(subjectId));
        if (type != null) return ResponseEntity.ok(noteRepository.findByType(type));
        return ResponseEntity.ok(noteRepository.findByIsPublished(true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getById(@PathVariable String id) {
        return ResponseEntity.ok(noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found: " + id)));
    }

    @PostMapping
    public ResponseEntity<Note> create(@Valid @RequestBody NoteRequest req,
                                       @AuthenticationPrincipal UserDetails u) {
        String teacherId = teacherRepository.findByUserId(u.getUsername())
                .map(t -> t.getId()).orElse(u.getUsername());

        Note note = Note.builder()
                .title(req.getTitle())
                .subjectId(req.getSubjectId())
                .subjectName(req.getSubjectName())
                .standard(req.getStandard())
                .content(req.getContent())
                .fileUrl(req.getFileUrl())
                .type(req.getType() != null ? req.getType() : "pdf")
                .uploadedBy(teacherId)
                .isPublished(true)
                .uploadedAt(LocalDateTime.now())
                .build();
        return ResponseEntity.status(201).body(noteRepository.save(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> update(@PathVariable String id,
                                       @Valid @RequestBody NoteRequest req) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found: " + id));
        note.setTitle(req.getTitle());
        note.setContent(req.getContent());
        note.setFileUrl(req.getFileUrl());
        note.setType(req.getType());
        return ResponseEntity.ok(noteRepository.save(note));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        noteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

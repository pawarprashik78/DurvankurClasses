package com.durvankarclasses.controller;

import com.durvankarclasses.model.Teacher;
import com.durvankarclasses.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherRepository teacherRepository;

    @GetMapping
    public ResponseEntity<List<Teacher>> getAll() {
        return ResponseEntity.ok(teacherRepository.findByIsActive(true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getById(@PathVariable String id) {
        return ResponseEntity.ok(teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> update(@PathVariable String id,
                                          @RequestBody Teacher updated) {
        Teacher existing = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + id));
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setSpecialization(updated.getSpecialization());
        existing.setQualifications(updated.getQualifications());
        existing.setSubjects(updated.getSubjects());
        existing.setExperience(updated.getExperience());
        return ResponseEntity.ok(teacherRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        Teacher t = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found: " + id));
        t.setActive(false);
        teacherRepository.save(t);
        return ResponseEntity.noContent().build();
    }
}

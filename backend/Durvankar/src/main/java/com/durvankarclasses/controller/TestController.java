package com.durvankarclasses.controller;

import com.durvankarclasses.dto.request.TestRequest;
import com.durvankarclasses.model.Test;
import com.durvankarclasses.repository.TestRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestRepository testRepository;

    @GetMapping
    public ResponseEntity<List<Test>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String standard) {
        if (standard != null && status != null)
            return ResponseEntity.ok(testRepository.findByStandardAndStatus(standard, status));
        if (standard != null)
            return ResponseEntity.ok(testRepository.findByStandard(standard));
        if (status != null)
            return ResponseEntity.ok(testRepository.findByStatus(status));
        return ResponseEntity.ok(testRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Test> getById(@PathVariable String id) {
        return ResponseEntity.ok(testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found: " + id)));
    }

    @PostMapping
    public ResponseEntity<Test> create(@Valid @RequestBody TestRequest req,
                                       @AuthenticationPrincipal UserDetails u) {
        Test test = Test.builder()
                .name(req.getName())
                .subjectId(req.getSubjectId())
                .standard(req.getStandard())
                .totalMarks(req.getTotalMarks())
                .testDate(req.getTestDate())
                .status(req.getStatus() != null ? req.getStatus() : "upcoming")
                .createdBy(u.getUsername())
                .createdAt(LocalDateTime.now())
                .build();
        return ResponseEntity.status(201).body(testRepository.save(test));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Test> update(@PathVariable String id,
                                       @Valid @RequestBody TestRequest req) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found: " + id));
        test.setName(req.getName());
        test.setTotalMarks(req.getTotalMarks());
        test.setTestDate(req.getTestDate());
        test.setStatus(req.getStatus());
        return ResponseEntity.ok(testRepository.save(test));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        testRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

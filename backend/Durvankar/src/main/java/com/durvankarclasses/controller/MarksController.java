package com.durvankarclasses.controller;

import com.durvankarclasses.dto.request.MarksRequest;
import com.durvankarclasses.model.Marks;
import com.durvankarclasses.repository.ParentRepository;
import com.durvankarclasses.repository.StudentRepository;
import com.durvankarclasses.repository.UserRepository;
import com.durvankarclasses.service.MarksService;
import com.durvankarclasses.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarksController {

    private final MarksService marksService;
    private final StudentService studentService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;

    /**
     * GET /api/marks
     * - Admin/Teacher: all marks
     * - Student: own marks only (by linkedId → studentId)
     * - Parent: marks for all linked students
     */
    @GetMapping
    public ResponseEntity<List<Marks>> getAll(@AuthenticationPrincipal UserDetails u) {
        var userOpt = userRepository.findById(u.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.ok(marksService.getAll());

        String role = userOpt.get().getRole();
        String linkedId = userOpt.get().getLinkedId();

        return switch (role) {
            case "student" -> ResponseEntity.ok(marksService.getByStudentId(linkedId));
            case "parent"  -> {
                var parent = parentRepository.findById(linkedId);
                if (parent.isEmpty() || parent.get().getStudentIds() == null)
                    yield ResponseEntity.ok(List.of());
                List<Marks> allMarks = new java.util.ArrayList<>();
                for (String sid : parent.get().getStudentIds())
                    allMarks.addAll(marksService.getByStudentId(sid));
                yield ResponseEntity.ok(allMarks);
            }
            default -> ResponseEntity.ok(marksService.getAll()); // admin | teacher
        };
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marks> getById(@PathVariable String id) {
        return ResponseEntity.ok(marksService.getById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(marksService.getByStudentId(studentId));
    }

    /** Student: view own marks */
    @GetMapping("/me")
    public ResponseEntity<List<Marks>> getMyMarks(@AuthenticationPrincipal UserDetails u) {
        String studentId = studentService.getByUserId(u.getUsername()).getId();
        return ResponseEntity.ok(marksService.getByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<Marks> create(@Valid @RequestBody MarksRequest req,
                                        @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.status(201).body(marksService.create(req, u.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marks> update(@PathVariable String id,
                                        @Valid @RequestBody MarksRequest req) {
        return ResponseEntity.ok(marksService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        marksService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

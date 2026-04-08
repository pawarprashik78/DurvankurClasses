package com.durvankarclasses.controller;

import com.durvankarclasses.dto.response.StudentStatsResponse;
import com.durvankarclasses.model.Student;
import com.durvankarclasses.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getAll(
            @RequestParam(required = false) String standard) {
        if (standard != null)
            return ResponseEntity.ok(studentService.getByStandard(standard));
        return ResponseEntity.ok(studentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable String id,
                                          @RequestBody Student student) {
        return ResponseEntity.ok(studentService.update(id, student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        studentService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<StudentStatsResponse> getStats(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getStats(id));
    }

    /** Student can fetch their own profile via /api/students/me */
    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(studentService.getByUserId(u.getUsername()));
    }
}

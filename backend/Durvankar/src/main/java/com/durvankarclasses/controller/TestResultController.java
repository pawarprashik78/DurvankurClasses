package com.durvankarclasses.controller;

import com.durvankarclasses.model.Marks;
import com.durvankarclasses.service.MarksService;
import com.durvankarclasses.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Alias controller used by the parent & student dashboard
 * to fetch test results at /api/test-results
 */
@RestController
@RequestMapping("/api/test-results")
@RequiredArgsConstructor
public class TestResultController {

    private final MarksService marksService;
    private final StudentService studentService;

    /** Returns marks/test-results for the currently logged-in student or parent's child */
    @GetMapping
    public ResponseEntity<List<Marks>> getMyResults(
            @AuthenticationPrincipal UserDetails u,
            @RequestParam(required = false) String testType) {

        String studentId = studentService.getByUserId(u.getUsername()).getId();
        List<Marks> results = marksService.getByStudentId(studentId);

        if (testType != null) {
            results = results.stream()
                    .filter(m -> testType.equals(m.getTestType()))
                    .toList();
        }
        return ResponseEntity.ok(results);
    }
}

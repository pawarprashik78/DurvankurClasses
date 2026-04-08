package com.durvankarclasses.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Returns the fixed subject list used across Marks, Tests, and Notes.
 */
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    public static final List<Map<String, String>> SUBJECTS = List.of(
        Map.of("id", "MATH",   "name", "Mathematics",                    "detail", "Algebra & Geometry"),
        Map.of("id", "SCI1",   "name", "Science & Technology I",         "detail", "Physics & Chemistry"),
        Map.of("id", "SCI2",   "name", "Science & Technology II",        "detail", "Biology & Environment"),
        Map.of("id", "SS",     "name", "Social Science",                 "detail", "History, Civics & Geography"),
        Map.of("id", "ENG",    "name", "English",                        "detail", "Language & Literature"),
        Map.of("id", "MAR",    "name", "Marathi",                        "detail", "Optional Language"),
        Map.of("id", "HIN",    "name", "Hindi",                          "detail", "Optional Language"),
        Map.of("id", "SAN",    "name", "Sanskrit",                       "detail", "Optional Language")
    );

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllSubjects() {
        return ResponseEntity.ok(SUBJECTS);
    }
}

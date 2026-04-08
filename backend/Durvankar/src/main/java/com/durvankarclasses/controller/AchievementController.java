package com.durvankarclasses.controller;

import com.durvankarclasses.model.Marks;
import com.durvankarclasses.model.Student;
import com.durvankarclasses.repository.MarksRepository;
import com.durvankarclasses.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Returns top achievers ranked by average marks percentage.
 * Uses live MongoDB data — falls back to dummy data if no marks exist.
 */
@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<Marks> allMarks = marksRepository.findAll();

        if (!allMarks.isEmpty()) {
            // Group marks by studentId, compute average percentage
            Map<String, List<Marks>> byStudent = allMarks.stream()
                    .collect(Collectors.groupingBy(Marks::getStudentId));

            List<Map<String, Object>> ranked = new ArrayList<>();

            for (Map.Entry<String, List<Marks>> entry : byStudent.entrySet()) {
                String studentId = entry.getKey();
                List<Marks> marks = entry.getValue();

                double totalObtained = marks.stream().mapToDouble(Marks::getMarksObtained).sum();
                double totalMax      = marks.stream().mapToDouble(Marks::getTotalMarks).sum();
                double pct = totalMax > 0 ? Math.round((totalObtained / totalMax * 100) * 10.0) / 10.0 : 0;

                String name = studentRepository.findById(studentId)
                        .map(Student::getName).orElse("Student");

                String grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" :
                               pct >= 60 ? "B"  : pct >= 50 ? "C" : "D";

                ranked.add(Map.of(
                        "id",         studentId,
                        "studentId",  studentId,
                        "name",       name,
                        "percentage", pct,
                        "grade",      grade,
                        "batchYear",  "2024-25",
                        "testCount",  marks.size()
                ));
            }

            ranked.sort(Comparator.comparingDouble(m -> -((Double) m.get("percentage"))));

            // Add rank
            List<Map<String, Object>> result = new ArrayList<>();
            for (int i = 0; i < ranked.size(); i++) {
                Map<String, Object> row = new LinkedHashMap<>(ranked.get(i));
                row.put("rank", i + 1);
                result.add(row);
            }
            return ResponseEntity.ok(result);
        }

        // Fallback dummy achievements
        return ResponseEntity.ok(List.of(
            Map.of("id","a1","name","Priya Sharma",   "batchYear","2024-25","rank",1,"percentage",96.2,"grade","A+","collegeAdmitted","Fergusson College, Pune"),
            Map.of("id","a2","name","Rohit Deshmukh", "batchYear","2024-25","rank",2,"percentage",94.8,"grade","A+","collegeAdmitted","SP College, Pune"),
            Map.of("id","a3","name","Snehal Patil",   "batchYear","2024-25","rank",3,"percentage",93.1,"grade","A+","collegeAdmitted","Nowrosjee Wadia College"),
            Map.of("id","a4","name","Aarav Kulkarni", "batchYear","2024-25","rank",4,"percentage",91.5,"grade","A+","collegeAdmitted","MIT College, Pune"),
            Map.of("id","a5","name","Diya Joshi",     "batchYear","2024-25","rank",5,"percentage",89.7,"grade","A", "collegeAdmitted","Pune University")
        ));
    }
}

package com.durvankarclasses.service;

import com.durvankarclasses.dto.request.MarksRequest;
import com.durvankarclasses.model.Marks;
import com.durvankarclasses.repository.MarksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarksService {

    private final MarksRepository marksRepository;

    public List<Marks> getAll() { return marksRepository.findAll(); }

    public List<Marks> getByStudentId(String studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public Marks getById(String id) {
        return marksRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marks record not found: " + id));
    }

    public Marks create(MarksRequest req, String enteredBy) {
        String grade = calculateGrade(req.getMarksObtained(), req.getTotalMarks());
        Marks marks = Marks.builder()
                .studentId(req.getStudentId())
                .subjectId(req.getSubjectId())
                .subjectName(req.getSubjectName())
                .testId(req.getTestId())
                .testName(req.getTestName())
                .testType(req.getTestType() != null ? req.getTestType() : "class_test")
                .marksObtained(req.getMarksObtained())
                .totalMarks(req.getTotalMarks())
                .grade(grade)
                .term(req.getTerm())
                .testDate(req.getTestDate())
                .remarks(req.getRemarks())
                .enteredBy(enteredBy)
                .createdAt(LocalDateTime.now())
                .build();
        return marksRepository.save(marks);
    }

    public Marks update(String id, MarksRequest req) {
        Marks marks = getById(id);
        marks.setMarksObtained(req.getMarksObtained());
        marks.setTotalMarks(req.getTotalMarks());
        marks.setGrade(calculateGrade(req.getMarksObtained(), req.getTotalMarks()));
        marks.setRemarks(req.getRemarks());
        return marksRepository.save(marks);
    }

    public void delete(String id) { marksRepository.deleteById(id); }

    private String calculateGrade(double obtained, double total) {
        if (total == 0) return "N/A";
        double pct = (obtained / total) * 100;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B+";
        if (pct >= 60) return "B";
        if (pct >= 50) return "C";
        if (pct >= 40) return "D";
        return "F";
    }
}

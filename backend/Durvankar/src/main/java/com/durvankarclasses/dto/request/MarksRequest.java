package com.durvankarclasses.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MarksRequest {
    @NotBlank private String studentId;
    @NotBlank private String subjectId;
    private String subjectName;          // denormalized for display
    private String testId;
    @NotBlank private String testName;
    /** class_test | college_test */
    private String testType = "class_test";
    @NotNull private Double marksObtained;
    @NotNull private Double totalMarks;
    private String term;
    @NotBlank private String testDate;   // yyyy-MM-dd
    private String remarks;
}

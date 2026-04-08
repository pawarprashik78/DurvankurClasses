package com.durvankarclasses.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TestRequest {
    @NotBlank private String name;
    @NotBlank private String subjectId;
    @NotBlank private String standard;
    @NotNull  private Double totalMarks;
    @NotBlank private String testDate;    // yyyy-MM-dd
    private String status = "upcoming";  // upcoming | completed | cancelled
}

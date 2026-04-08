package com.durvankarclasses.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRequest {
    @NotBlank private String studentId;
    @NotBlank private String date;       // yyyy-MM-dd
    @NotBlank private String status;     // present | absent | late
    private String remarks;
}

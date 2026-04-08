package com.durvankarclasses.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeeRequest {
    @NotBlank private String studentId;
    @NotBlank private String month;
    @NotNull  private Integer year;
    @NotNull  private Double amount;
    private Double paidAmount = 0.0;
    private String status = "pending";     // paid | pending | partial
    private String paymentDate;            // yyyy-MM-dd
    private String paymentMode;            // cash | online | cheque
    private String remarks;
}

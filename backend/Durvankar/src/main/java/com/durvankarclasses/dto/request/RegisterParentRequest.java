package com.durvankarclasses.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterParentRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String phone;
    /** The roll number of the student this parent is linked to */
    @NotBlank private String studentRollNumber;
    @NotBlank private String password;
}

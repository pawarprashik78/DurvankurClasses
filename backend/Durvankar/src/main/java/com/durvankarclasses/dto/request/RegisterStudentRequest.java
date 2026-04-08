package com.durvankarclasses.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterStudentRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String phone;
    @NotBlank private String standard;
    @NotBlank private String rollNumber;
    @NotBlank private String dateOfBirth;
    @NotBlank private String address;
    @NotBlank private String parentName;
    @NotBlank @Email private String parentEmail;
    @NotBlank private String parentPhone;
    @NotBlank private String password;  // student login password
}

package com.durvankarclasses.controller;

import com.durvankarclasses.dto.request.LoginRequest;
import com.durvankarclasses.dto.request.RegisterStudentRequest;
import com.durvankarclasses.dto.request.RegisterTeacherRequest;
import com.durvankarclasses.dto.request.RegisterAdminRequest;
import com.durvankarclasses.dto.request.RegisterParentRequest;
import com.durvankarclasses.dto.response.AuthResponse;
import com.durvankarclasses.model.User;
import com.durvankarclasses.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Health check — used by Render to verify the service is up */
    @GetMapping("/health")
    public ResponseEntity<java.util.Map<String, String>> health() {
        return ResponseEntity.ok(java.util.Map.of("status", "UP", "service", "Durvankar Classes API"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody RegisterStudentRequest req) {
        return ResponseEntity.status(201).body(authService.registerStudent(req));
    }

    @PostMapping("/register/teacher")
    public ResponseEntity<AuthResponse> registerTeacher(@Valid @RequestBody RegisterTeacherRequest req) {
        return ResponseEntity.status(201).body(authService.registerTeacher(req));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<AuthResponse> registerAdmin(@Valid @RequestBody RegisterAdminRequest req) {
        return ResponseEntity.status(201).body(authService.registerAdmin(req));
    }

    /**
     * Parent self-registration — linked to student by roll number.
     * Also supports parents whose account was auto-created during student registration.
     */
    @PostMapping("/register/parent")
    public ResponseEntity<AuthResponse> registerParent(@RequestBody RegisterParentRequest req) {
        return ResponseEntity.status(201).body(authService.registerParent(req));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
    }
}

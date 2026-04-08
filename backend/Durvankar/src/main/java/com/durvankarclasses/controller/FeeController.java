package com.durvankarclasses.controller;

import com.durvankarclasses.dto.request.FeeRequest;
import com.durvankarclasses.dto.response.FeeStatsResponse;
import com.durvankarclasses.model.Fee;
import com.durvankarclasses.service.FeeService;
import com.durvankarclasses.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;
    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Fee>> getAll() {
        return ResponseEntity.ok(feeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getById(@PathVariable String id) {
        return ResponseEntity.ok(feeService.getById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Fee>> getMyFees(@AuthenticationPrincipal UserDetails u) {
        String studentId = studentService.getByUserId(u.getUsername()).getId();
        return ResponseEntity.ok(feeService.getByStudentId(studentId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Fee>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(feeService.getByStudentId(studentId));
    }

    @GetMapping("/stats/{studentId}")
    public ResponseEntity<FeeStatsResponse> getStats(@PathVariable String studentId) {
        return ResponseEntity.ok(feeService.getStats(studentId));
    }

    @PostMapping
    public ResponseEntity<Fee> create(@Valid @RequestBody FeeRequest req,
                                      @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.status(201).body(feeService.create(req, u.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> update(@PathVariable String id,
                                      @Valid @RequestBody FeeRequest req) {
        return ResponseEntity.ok(feeService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        feeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

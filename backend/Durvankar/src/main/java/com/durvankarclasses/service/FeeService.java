package com.durvankarclasses.service;

import com.durvankarclasses.dto.request.FeeRequest;
import com.durvankarclasses.dto.response.FeeStatsResponse;
import com.durvankarclasses.model.Fee;
import com.durvankarclasses.model.Student;
import com.durvankarclasses.repository.FeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final StudentService studentService;

    public List<Fee> getAll() { return feeRepository.findAll(); }

    public List<Fee> getByStudentId(String studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    public Fee getById(String id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee record not found: " + id));
    }

    public Fee create(FeeRequest req, String createdBy) {
        if (feeRepository.existsByStudentIdAndMonthAndYear(req.getStudentId(), req.getMonth(), req.getYear())) {
            throw new RuntimeException("Fee record already exists for " + req.getMonth() + " " + req.getYear());
        }
        Fee fee = Fee.builder()
                .studentId(req.getStudentId())
                .month(req.getMonth())
                .year(req.getYear())
                .amount(req.getAmount())
                .paidAmount(req.getPaidAmount() != null ? req.getPaidAmount() : 0)
                .status(req.getStatus() != null ? req.getStatus() : "pending")
                .paymentDate(req.getPaymentDate())
                .paymentMode(req.getPaymentMode())
                .remarks(req.getRemarks())
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now())
                .build();
        return feeRepository.save(fee);
    }

    public Fee update(String id, FeeRequest req) {
        Fee fee = getById(id);
        fee.setPaidAmount(req.getPaidAmount() != null ? req.getPaidAmount() : fee.getPaidAmount());
        fee.setStatus(req.getStatus() != null ? req.getStatus() : fee.getStatus());
        fee.setPaymentDate(req.getPaymentDate());
        fee.setPaymentMode(req.getPaymentMode());
        fee.setRemarks(req.getRemarks());
        return feeRepository.save(fee);
    }

    public void delete(String id) { feeRepository.deleteById(id); }

    public FeeStatsResponse getStats(String studentId) {
        Student student = studentService.getById(studentId);
        List<Fee> fees = feeRepository.findByStudentId(studentId);

        double total = fees.stream().mapToDouble(Fee::getAmount).sum();
        double paid = fees.stream().mapToDouble(Fee::getPaidAmount).sum();
        long paidMonths = fees.stream().filter(f -> "paid".equals(f.getStatus())).count();
        long pendingMonths = fees.stream().filter(f -> "pending".equals(f.getStatus()) || "partial".equals(f.getStatus())).count();

        return FeeStatsResponse.builder()
                .studentId(studentId)
                .studentName(student.getName())
                .totalAmount(total)
                .paidAmount(paid)
                .pendingAmount(total - paid)
                .paidMonths(paidMonths)
                .pendingMonths(pendingMonths)
                .build();
    }
}

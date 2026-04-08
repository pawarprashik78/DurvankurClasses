package com.durvankarclasses.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendAbsenceAlert(String parentEmail, String parentName, String studentName, String date) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("durvankarclasses@gmail.com");
            msg.setTo(parentEmail);
            msg.setSubject("Absence Alert: " + studentName + " was absent on " + date);
            msg.setText(
                "Dear " + parentName + ",\n\n" +
                "This is to inform you that your child " + studentName +
                " was marked ABSENT on " + date + ".\n\n" +
                "Please ensure regular attendance for better performance.\n\n" +
                "Regards,\nDurvankar Coaching Classes"
            );
            mailSender.send(msg);
            log.info("Absence email sent to {} for student {}", parentEmail, studentName);
        } catch (Exception e) {
            log.warn("Could not send absence email to {}: {}", parentEmail, e.getMessage());
        }
    }
}

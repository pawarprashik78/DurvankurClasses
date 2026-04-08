package com.durvankarclasses.service;

import com.durvankarclasses.dto.request.LoginRequest;
import com.durvankarclasses.dto.request.RegisterStudentRequest;
import com.durvankarclasses.dto.request.RegisterTeacherRequest;
import com.durvankarclasses.dto.request.RegisterAdminRequest;
import com.durvankarclasses.dto.request.RegisterParentRequest;
import com.durvankarclasses.dto.response.AuthResponse;
import com.durvankarclasses.model.*;
import com.durvankarclasses.repository.*;
import com.durvankarclasses.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Resolve name from linked profile
        String name = resolveName(user);

        String token = tokenProvider.generateToken(user.getId(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .userId(user.getId())
                .linkedId(user.getLinkedId())
                .name(name)
                .email(user.getEmail())
                .build();
    }

    public AuthResponse registerStudent(RegisterStudentRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered: " + req.getEmail());
        if (studentRepository.existsByRollNumber(req.getRollNumber()))
            throw new RuntimeException("Roll number already exists: " + req.getRollNumber());

        // 1. Create or find parent
        Parent parent = parentRepository.findByEmail(req.getParentEmail())
                .orElseGet(() -> {
                    User parentUser = User.builder()
                            .email(req.getParentEmail())
                            .username(req.getParentEmail())
                            .passwordHash(passwordEncoder.encode(req.getPassword()))
                            .role("parent")
                            .isActive(true)
                            .createdAt(LocalDateTime.now())
                            .build();
                    parentUser = userRepository.save(parentUser);

                    Parent p = Parent.builder()
                            .userId(parentUser.getId())
                            .name(req.getParentName())
                            .email(req.getParentEmail())
                            .phone(req.getParentPhone())
                            .studentIds(new java.util.ArrayList<>())
                            .createdAt(LocalDateTime.now())
                            .build();
                    p = parentRepository.save(p);

                    parentUser.setLinkedId(p.getId());
                    userRepository.save(parentUser);
                    return p;
                });

        // 2. Create student user
        User studentUser = User.builder()
                .email(req.getEmail())
                .username(req.getRollNumber())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role("student")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        studentUser = userRepository.save(studentUser);

        // 3. Create student profile
        Student student = Student.builder()
                .userId(studentUser.getId())
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .standard(req.getStandard())
                .rollNumber(req.getRollNumber())
                .dateOfBirth(req.getDateOfBirth())
                .address(req.getAddress())
                .parentId(parent.getId())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        student = studentRepository.save(student);

        // 4. Link student user → student profile
        studentUser.setLinkedId(student.getId());
        userRepository.save(studentUser);

        // 5. Add student to parent's list
        parent.getStudentIds().add(student.getId());
        parentRepository.save(parent);

        String token = tokenProvider.generateToken(studentUser.getId(), "student");
        return AuthResponse.builder()
                .token(token).role("student")
                .userId(studentUser.getId())
                .linkedId(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .build();
    }

    public AuthResponse registerTeacher(RegisterTeacherRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered: " + req.getEmail());

        User teacherUser = User.builder()
                .email(req.getEmail())
                .username(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role("teacher")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        teacherUser = userRepository.save(teacherUser);

        Teacher teacher = Teacher.builder()
                .userId(teacherUser.getId())
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .specialization(req.getSpecialization())
                .qualifications(req.getQualifications())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        teacher = teacherRepository.save(teacher);

        teacherUser.setLinkedId(teacher.getId());
        userRepository.save(teacherUser);

        String token = tokenProvider.generateToken(teacherUser.getId(), "teacher");
        return AuthResponse.builder()
                .token(token).role("teacher")
                .userId(teacherUser.getId())
                .linkedId(teacher.getId())
                .name(teacher.getName())
                .email(teacher.getEmail())
                .build();
    }

    public AuthResponse registerAdmin(RegisterAdminRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered: " + req.getEmail());

        User adminUser = User.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role("admin")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        adminUser = userRepository.save(adminUser);

        String token = tokenProvider.generateToken(adminUser.getId(), "admin");
        return AuthResponse.builder()
                .token(token).role("admin")
                .userId(adminUser.getId())
                .name(adminUser.getUsername())
                .email(adminUser.getEmail())
                .build();
    }

    /**
     * Parent self-registration.
     * Links parent to an existing student using the student's roll number.
     * If a parent account was auto-created during student registration,
     * this sets a real password so the parent can actually log in.
     */
    public AuthResponse registerParent(RegisterParentRequest req) {
        // 1. Find the linked student
        Student student = studentRepository.findByRollNumber(req.getStudentRollNumber())
                .orElseThrow(() -> new RuntimeException(
                        "No student found with roll number: " + req.getStudentRollNumber()));

        // 2. Find or create parent profile
        Parent parent;
        User parentUser;

        java.util.Optional<Parent> existingParent = parentRepository.findByEmail(req.getEmail());
        if (existingParent.isPresent()) {
            // Parent profile already exists (auto-created during student registration)
            parent = existingParent.get();
            parentUser = userRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("Parent user account inconsistency"));
            // Update password so parent can now log in with their own password
            parentUser.setPasswordHash(passwordEncoder.encode(req.getPassword()));
            parentUser.setActive(true);
            userRepository.save(parentUser);
        } else {
            // Check email not taken
            if (userRepository.existsByEmail(req.getEmail()))
                throw new RuntimeException("Email already registered: " + req.getEmail());

            // Create fresh parent user
            parentUser = User.builder()
                    .email(req.getEmail())
                    .username(req.getEmail())
                    .passwordHash(passwordEncoder.encode(req.getPassword()))
                    .role("parent")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            parentUser = userRepository.save(parentUser);

            parent = Parent.builder()
                    .userId(parentUser.getId())
                    .name(req.getName())
                    .email(req.getEmail())
                    .phone(req.getPhone())
                    .studentIds(new java.util.ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .build();
            parent = parentRepository.save(parent);

            parentUser.setLinkedId(parent.getId());
            userRepository.save(parentUser);
        }

        // 3. Link student to this parent (if not already)
        if (!parent.getStudentIds().contains(student.getId())) {
            parent.getStudentIds().add(student.getId());
            parentRepository.save(parent);
        }
        // Update student's parentId if missing
        if (student.getParentId() == null) {
            student.setParentId(parent.getId());
            studentRepository.save(student);
        }

        String token = tokenProvider.generateToken(parentUser.getId(), "parent");
        return AuthResponse.builder()
                .token(token).role("parent")
                .userId(parentUser.getId())
                .linkedId(parent.getId())
                .name(parent.getName() != null ? parent.getName() : req.getName())
                .email(parent.getEmail())
                .build();
    }

    public User getCurrentUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String resolveName(User user) {
        try {
            return switch (user.getRole()) {
                case "student" -> studentRepository.findById(user.getLinkedId())
                        .map(Student::getName).orElse(user.getEmail());
                case "parent" -> parentRepository.findById(user.getLinkedId())
                        .map(Parent::getName).orElse(user.getEmail());
                case "teacher" -> teacherRepository.findById(user.getLinkedId())
                        .map(Teacher::getName).orElse(user.getEmail());
                default -> user.getUsername() != null ? user.getUsername() : user.getEmail();
            };
        } catch (Exception e) {
            return user.getEmail();
        }
    }
}

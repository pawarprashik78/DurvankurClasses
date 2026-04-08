package com.durvankarclasses.dto.response;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String userId;
    private String linkedId;
    private String name;
    private String email;
}

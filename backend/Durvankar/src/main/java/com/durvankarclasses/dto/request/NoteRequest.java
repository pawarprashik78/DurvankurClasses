package com.durvankarclasses.dto.request;

import lombok.Data;

@Data
public class NoteRequest {
    private String title;
    private String subjectId;
    private String subjectName;  // denormalized for display
    private String standard;
    private String content;
    private String fileUrl;
    /** pdf | ppt | video */
    private String type = "pdf";
}

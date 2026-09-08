package com.taskmanager.dto;

import com.taskmanager.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Priority priority;

    private LocalDate dueDate;

    private boolean completed;
}

package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Priority;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            Authentication authentication,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Boolean completed) {

        String username = authentication.getName();

        if (keyword != null || priority != null || completed != null) {
            return ResponseEntity.ok(taskService.searchTasks(username, keyword, priority, completed));
        }
        return ResponseEntity.ok(taskService.getAllTasks(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(authentication.getName(), id));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(Authentication authentication,
                                                     @Valid @RequestBody TaskRequest request) {
        TaskResponse created = taskService.createTask(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(Authentication authentication,
                                                     @PathVariable Long id,
                                                     @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(authentication.getName(), id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskResponse> toggleCompletion(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(taskService.toggleCompletion(authentication.getName(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(Authentication authentication, @PathVariable Long id) {
        taskService.deleteTask(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}

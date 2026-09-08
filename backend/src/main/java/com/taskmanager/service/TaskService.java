package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Priority;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }

    public List<TaskResponse> getAllTasks(String username) {
        User user = getUserByUsername(username);
        return taskRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(TaskResponse::fromEntity)
                .toList();
    }

    public List<TaskResponse> searchTasks(String username, String keyword, Priority priority, Boolean completed) {
        User user = getUserByUsername(username);
        return taskRepository.search(user.getId(), keyword, priority, completed)
                .stream()
                .map(TaskResponse::fromEntity)
                .toList();
    }

    public TaskResponse getTaskById(String username, Long taskId) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        return TaskResponse.fromEntity(task);
    }

    public TaskResponse createTask(String username, TaskRequest request) {
        User user = getUserByUsername(username);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .dueDate(request.getDueDate())
                .completed(request.isCompleted())
                .user(user)
                .build();

        return TaskResponse.fromEntity(taskRepository.save(task));
    }

    public TaskResponse updateTask(String username, Long taskId, TaskRequest request) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());
        task.setCompleted(request.isCompleted());

        return TaskResponse.fromEntity(taskRepository.save(task));
    }

    public TaskResponse toggleCompletion(String username, Long taskId) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setCompleted(!task.isCompleted());
        return TaskResponse.fromEntity(taskRepository.save(task));
    }

    public void deleteTask(String username, Long taskId) {
        User user = getUserByUsername(username);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not allowed to delete this task");
        }

        taskRepository.delete(task);
    }
}

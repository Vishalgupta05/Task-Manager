package com.taskmanager.repository;

import com.taskmanager.entity.Priority;
import com.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    @Query("""
           SELECT t FROM Task t
           WHERE t.user.id = :userId
           AND (:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
           AND (:priority IS NULL OR t.priority = :priority)
           AND (:completed IS NULL OR t.completed = :completed)
           ORDER BY t.createdAt DESC
           """)
    List<Task> search(@Param("userId") Long userId,
                       @Param("keyword") String keyword,
                       @Param("priority") Priority priority,
                       @Param("completed") Boolean completed);
}

package com.neuroforge.neuroforge_backend.repository;

import com.neuroforge.neuroforge_backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
}
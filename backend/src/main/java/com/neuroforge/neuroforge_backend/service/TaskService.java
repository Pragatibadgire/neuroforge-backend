package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.Task;
import com.neuroforge.neuroforge_backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // CREATE
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // READ ALL
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // READ ONE
    public Optional<Task> getTaskById(Integer id) {
        return taskRepository.findById(id);
    }

    // UPDATE
    public Task updateTask(Integer id, Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();

            task.setTaskName(taskDetails.getTaskName());
            task.setDescription(taskDetails.getDescription());
            task.setStatus(taskDetails.getStatus());
            task.setDueDate(taskDetails.getDueDate());
            task.setProjectId(taskDetails.getProjectId());

            return taskRepository.save(task);
        }

        return null;
    }

    // DELETE
    public void deleteTask(Integer id) {
        taskRepository.deleteById(id);
    }
}
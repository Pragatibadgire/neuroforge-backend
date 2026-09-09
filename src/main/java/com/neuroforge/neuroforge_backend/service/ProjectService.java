package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.Project;
import com.neuroforge.neuroforge_backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // CREATE
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // READ ALL
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // READ BY ID
    public Optional<Project> getProjectById(Integer id) {
        return projectRepository.findById(id);
    }

    // UPDATE
    public Project updateProject(Integer id, Project project) {

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existingProject.setProjectName(project.getProjectName());
        existingProject.setDescription(project.getDescription());
        existingProject.setStartDate(project.getStartDate());
        existingProject.setEndDate(project.getEndDate());
        existingProject.setStatus(project.getStatus());
        existingProject.setManagerId(project.getManagerId());

        return projectRepository.save(existingProject);
    }

    // DELETE
    public void deleteProject(Integer id) {
        projectRepository.deleteById(id);
    }
}
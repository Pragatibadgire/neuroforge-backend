package com.neuroforge.neuroforge_backend.controller;

import com.neuroforge.neuroforge_backend.entity.Project;
import com.neuroforge.neuroforge_backend.service.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // CREATE
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    // READ ALL
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {

        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Integer id,
            @RequestBody Project project) {

        return projectService.updateProject(id, project);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(
            @PathVariable Integer id) {

        projectService.deleteProject(id);

        return ResponseEntity.ok("Project deleted successfully");
    }
}
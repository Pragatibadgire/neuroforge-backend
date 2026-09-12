package com.neuroforge.neuroforge_backend.controller;

import com.neuroforge.neuroforge_backend.entity.Repository;
import com.neuroforge.neuroforge_backend.service.RepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repositories")
public class RepositoryController {

    private final RepositoryService repositoryService;

    public RepositoryController(RepositoryService repositoryService) {
        this.repositoryService = repositoryService;
    }

    @GetMapping
    public List<Repository> getAllRepositories() {
        return repositoryService.getAllRepositories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Repository> getRepositoryById(@PathVariable Integer id) {
        return repositoryService.getRepositoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Repository createRepository(@RequestBody Repository repository) {
        return repositoryService.createRepository(repository);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Repository> updateRepository(
            @PathVariable Integer id,
            @RequestBody Repository repository) {

        Repository updated = repositoryService.updateRepository(id, repository);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepository(@PathVariable Integer id) {

        if (repositoryService.deleteRepository(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
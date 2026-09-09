package com.neuroforge.neuroforge_backend.controller;

import com.neuroforge.neuroforge_backend.entity.CodeCommit;
import com.neuroforge.neuroforge_backend.service.CodeCommitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/code-commits")
public class CodeCommitController {

    private final CodeCommitService codeCommitService;

    public CodeCommitController(CodeCommitService codeCommitService) {
        this.codeCommitService = codeCommitService;
    }

    @GetMapping
    public List<CodeCommit> getAllCommits() {
        return codeCommitService.getAllCommits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodeCommit> getCommitById(@PathVariable Integer id) {
        return codeCommitService.getCommitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CodeCommit createCommit(@RequestBody CodeCommit commit) {
        return codeCommitService.createCommit(commit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CodeCommit> updateCommit(
            @PathVariable Integer id,
            @RequestBody CodeCommit commit) {

        CodeCommit updated = codeCommitService.updateCommit(id, commit);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommit(@PathVariable Integer id) {

        if (codeCommitService.deleteCommit(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
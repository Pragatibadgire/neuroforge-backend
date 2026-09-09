package com.neuroforge.neuroforge_backend.controller;

import com.neuroforge.neuroforge_backend.entity.Requirement;
import com.neuroforge.neuroforge_backend.service.RequirementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
public class RequirementController {

    private final RequirementService requirementService;

    public RequirementController(RequirementService requirementService) {
        this.requirementService = requirementService;
    }

    // CREATE
    @PostMapping
    public Requirement createRequirement(@RequestBody Requirement requirement) {
        return requirementService.createRequirement(requirement);
    }

    // READ ALL
    @GetMapping
    public List<Requirement> getAllRequirements() {
        return requirementService.getAllRequirements();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Requirement> getRequirementById(@PathVariable Integer id) {
        return requirementService.getRequirementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public Requirement updateRequirement(
            @PathVariable Integer id,
            @RequestBody Requirement requirement) {
        return requirementService.updateRequirement(id, requirement);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequirement(@PathVariable Integer id) {
        requirementService.deleteRequirement(id);
        return ResponseEntity.noContent().build();
    }
}
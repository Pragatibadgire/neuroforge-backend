package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.Requirement;
import com.neuroforge.neuroforge_backend.repository.RequirementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;

    public RequirementService(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    // Create Requirement
    public Requirement createRequirement(Requirement requirement) {
        return requirementRepository.save(requirement);
    }

    // Get all Requirements
    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAll();
    }

    // Get Requirement by ID
    public Optional<Requirement> getRequirementById(Integer id) {
        return requirementRepository.findById(id);
    }

    // Update Requirement
    public Requirement updateRequirement(Integer id, Requirement requirement) {

        Requirement existingRequirement = requirementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Requirement not found"));

        existingRequirement.setTitle(requirement.getTitle());
        existingRequirement.setDescription(requirement.getDescription());
        existingRequirement.setPriority(requirement.getPriority());
        existingRequirement.setStatus(requirement.getStatus());
        existingRequirement.setProjectId(requirement.getProjectId());

        return requirementRepository.save(existingRequirement);
    }

    // Delete Requirement
    public void deleteRequirement(Integer id) {
        requirementRepository.deleteById(id);
    }
}
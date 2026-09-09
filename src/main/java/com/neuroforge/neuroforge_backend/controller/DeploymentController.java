package com.neuroforge.neuroforge_backend.controller;

import com.neuroforge.neuroforge_backend.entity.Deployment;
import com.neuroforge.neuroforge_backend.service.DeploymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DeploymentService deploymentService;

    public DeploymentController(DeploymentService deploymentService) {
        this.deploymentService = deploymentService;
    }

    @GetMapping
    public List<Deployment> getAllDeployments() {
        return deploymentService.getAllDeployments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deployment> getDeploymentById(@PathVariable Integer id) {
        return deploymentService.getDeploymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Deployment createDeployment(@RequestBody Deployment deployment) {
        return deploymentService.createDeployment(deployment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Deployment> updateDeployment(
            @PathVariable Integer id,
            @RequestBody Deployment deployment) {

        Deployment updated = deploymentService.updateDeployment(id, deployment);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeployment(@PathVariable Integer id) {

        if (deploymentService.deleteDeployment(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
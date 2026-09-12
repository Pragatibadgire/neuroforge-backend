package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.Deployment;
import com.neuroforge.neuroforge_backend.repository.DeploymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;

    public DeploymentService(DeploymentRepository deploymentRepository) {
        this.deploymentRepository = deploymentRepository;
    }

    public List<Deployment> getAllDeployments() {
        return deploymentRepository.findAll();
    }

    public Optional<Deployment> getDeploymentById(Integer id) {
        return deploymentRepository.findById(id);
    }

    public Deployment createDeployment(Deployment deployment) {
        return deploymentRepository.save(deployment);
    }

    public Deployment updateDeployment(Integer id, Deployment deployment) {
        if (deploymentRepository.existsById(id)) {
            deployment.setDeploymentId(id);
            return deploymentRepository.save(deployment);
        }

        return null;
    }

    public boolean deleteDeployment(Integer id) {
        if (deploymentRepository.existsById(id)) {
            deploymentRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
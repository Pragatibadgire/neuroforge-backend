package com.neuroforge.neuroforge_backend.repository;

import com.neuroforge.neuroforge_backend.entity.Deployment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeploymentRepository extends JpaRepository<Deployment, Integer> {
}
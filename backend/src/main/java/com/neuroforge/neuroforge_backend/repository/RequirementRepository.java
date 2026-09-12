package com.neuroforge.neuroforge_backend.repository;

import com.neuroforge.neuroforge_backend.entity.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Integer> {
}
package com.neuroforge.neuroforge_backend.repository;

import com.neuroforge.neuroforge_backend.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositoryRepository extends JpaRepository<Repository, Integer> {
}
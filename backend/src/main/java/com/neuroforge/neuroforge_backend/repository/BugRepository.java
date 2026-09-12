package com.neuroforge.neuroforge_backend.repository;

import com.neuroforge.neuroforge_backend.entity.Bug;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BugRepository extends JpaRepository<Bug, Integer> {
}
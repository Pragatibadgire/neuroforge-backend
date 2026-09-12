package com.neuroforge.neuroforge_backend.repository;

import com.neuroforge.neuroforge_backend.entity.CodeCommit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeCommitRepository extends JpaRepository<CodeCommit, Integer> {
}
package com.neuroforge.neuroforge_backend.repository;

import com.neuroforge.neuroforge_backend.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestCaseRepository extends JpaRepository<TestCase, Integer> {
}
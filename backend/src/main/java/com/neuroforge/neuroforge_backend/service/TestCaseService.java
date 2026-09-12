package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.TestCase;
import com.neuroforge.neuroforge_backend.repository.TestCaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;

    public TestCaseService(TestCaseRepository testCaseRepository) {
        this.testCaseRepository = testCaseRepository;
    }

    public List<TestCase> getAllTestCases() {
        return testCaseRepository.findAll();
    }

    public Optional<TestCase> getTestCaseById(Integer id) {
        return testCaseRepository.findById(id);
    }

    public TestCase createTestCase(TestCase testCase) {
        return testCaseRepository.save(testCase);
    }

    public TestCase updateTestCase(Integer id, TestCase testCase) {
        if (testCaseRepository.existsById(id)) {
            testCase.setTestcaseId(id);
            return testCaseRepository.save(testCase);
        }

        return null;
    }

    public boolean deleteTestCase(Integer id) {
        if (testCaseRepository.existsById(id)) {
            testCaseRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
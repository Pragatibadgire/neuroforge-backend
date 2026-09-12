package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.CodeCommit;
import com.neuroforge.neuroforge_backend.repository.CodeCommitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CodeCommitService {

    private final CodeCommitRepository codeCommitRepository;

    public CodeCommitService(CodeCommitRepository codeCommitRepository) {
        this.codeCommitRepository = codeCommitRepository;
    }

    public List<CodeCommit> getAllCommits() {
        return codeCommitRepository.findAll();
    }

    public Optional<CodeCommit> getCommitById(Integer id) {
        return codeCommitRepository.findById(id);
    }

    public CodeCommit createCommit(CodeCommit commit) {
        return codeCommitRepository.save(commit);
    }

    public CodeCommit updateCommit(Integer id, CodeCommit commit) {
        if (codeCommitRepository.existsById(id)) {
            commit.setCommitId(id);
            return codeCommitRepository.save(commit);
        }

        return null;
    }

    public boolean deleteCommit(Integer id) {
        if (codeCommitRepository.existsById(id)) {
            codeCommitRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
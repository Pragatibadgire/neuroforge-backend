package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.Repository;
import com.neuroforge.neuroforge_backend.repository.RepositoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RepositoryService {

    private final RepositoryRepository repositoryRepository;

    public RepositoryService(RepositoryRepository repositoryRepository) {
        this.repositoryRepository = repositoryRepository;
    }

    public List<Repository> getAllRepositories() {
        return repositoryRepository.findAll();
    }

    public Optional<Repository> getRepositoryById(Integer id) {
        return repositoryRepository.findById(id);
    }

    public Repository createRepository(Repository repository) {
        return repositoryRepository.save(repository);
    }

    public Repository updateRepository(Integer id, Repository repository) {
        Optional<Repository> existing = repositoryRepository.findById(id);

        if (existing.isPresent()) {
            repository.setRepositoryId(id);
            return repositoryRepository.save(repository);
        }

        return null;
    }

    public boolean deleteRepository(Integer id) {
        if (repositoryRepository.existsById(id)) {
            repositoryRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
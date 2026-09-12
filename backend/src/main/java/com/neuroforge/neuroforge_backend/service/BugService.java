package com.neuroforge.neuroforge_backend.service;

import com.neuroforge.neuroforge_backend.entity.Bug;
import com.neuroforge.neuroforge_backend.repository.BugRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BugService {

    private final BugRepository bugRepository;

    public BugService(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    public Optional<Bug> getBugById(Integer id) {
        return bugRepository.findById(id);
    }

    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }

    public Bug updateBug(Integer id, Bug bug) {
        if (bugRepository.existsById(id)) {
            bug.setBugId(id);
            return bugRepository.save(bug);
        }

        return null;
    }

    public boolean deleteBug(Integer id) {
        if (bugRepository.existsById(id)) {
            bugRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
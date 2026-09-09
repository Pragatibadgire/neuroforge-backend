package com.neuroforge.neuroforge_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "code_commits")
public class CodeCommit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commit_id")
    private Integer commitId;

    @Column(name = "commit_message")
    private String commitMessage;

    @Column(name = "commit_date")
    private LocalDate commitDate;

    @Column(name = "file_changed")
    private String fileChanged;

    @Column(name = "repository_link")
    private String repositoryLink;

    @Column(name = "task_id")
    private Integer taskId;

    public Integer getCommitId() {
        return commitId;
    }

    public void setCommitId(Integer commitId) {
        this.commitId = commitId;
    }

    public String getCommitMessage() {
        return commitMessage;
    }

    public void setCommitMessage(String commitMessage) {
        this.commitMessage = commitMessage;
    }

    public LocalDate getCommitDate() {
        return commitDate;
    }

    public void setCommitDate(LocalDate commitDate) {
        this.commitDate = commitDate;
    }

    public String getFileChanged() {
        return fileChanged;
    }

    public void setFileChanged(String fileChanged) {
        this.fileChanged = fileChanged;
    }

    public String getRepositoryLink() {
        return repositoryLink;
    }

    public void setRepositoryLink(String repositoryLink) {
        this.repositoryLink = repositoryLink;
    }

    public Integer getTaskId() {
        return taskId;
    }

    public void setTaskId(Integer taskId) {
        this.taskId = taskId;
    }
}
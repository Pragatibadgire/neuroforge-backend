import { useEffect, useState } from "react";
import {
  getCodeCommits,
  createCodeCommit,
  updateCodeCommit,
  deleteCodeCommit,
} from "../services/api";

function CodeCommits() {
  const emptyForm = {
    commitMessage: "",
    fileChanged: "",
    repositoryLink: "",
    commitDate: "",
    taskId: "",
  };

  const [commits, setCommits] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadCommits = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCodeCommits();
      setCommits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load code commits."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.commitMessage.trim()) {
      setError("Commit message is required.");
      return;
    }

    if (form.commitMessage.trim().length < 2) {
      setError("Commit message must contain at least 2 characters.");
      return;
    }

    if (!form.fileChanged.trim()) {
      setError("File changed is required.");
      return;
    }

    if (!form.repositoryLink.trim()) {
      setError("Repository link is required.");
      return;
    }

    try {
      new URL(form.repositoryLink.trim());
    } catch {
      setError("Please enter a valid repository URL.");
      return;
    }

    if (!form.commitDate) {
      setError("Commit date is required.");
      return;
    }

    if (!form.taskId || Number(form.taskId) <= 0) {
      setError("Please enter a valid Task ID.");
      return;
    }

    const commitData = {
      commitMessage: form.commitMessage.trim(),
      fileChanged: form.fileChanged.trim(),
      repositoryLink: form.repositoryLink.trim(),
      commitDate: form.commitDate,
      taskId: Number(form.taskId),
    };

    try {
      setSaving(true);

      if (editingId !== null) {
        await updateCodeCommit(editingId, commitData);
        setMessage("Code commit updated successfully.");
      } else {
        await createCodeCommit(commitData);
        setMessage("Code commit created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadCommits();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save code commit."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (commit) => {
    setEditingId(commit.commitId);

    setForm({
      commitMessage: commit.commitMessage || "",
      fileChanged: commit.fileChanged || "",
      repositoryLink: commit.repositoryLink || "",
      commitDate: commit.commitDate || "",
      taskId:
        commit.taskId !== null &&
        commit.taskId !== undefined
          ? String(commit.taskId)
          : "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this code commit?"
      )
    ) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteCodeCommit(id);

      setMessage("Code commit deleted successfully.");

      await loadCommits();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete code commit."
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  const filteredCommits = commits.filter((commit) => {
    const search = searchTerm.toLowerCase();

    return (
      String(commit.commitId || "")
        .toLowerCase()
        .includes(search) ||
      String(commit.commitMessage || "")
        .toLowerCase()
        .includes(search) ||
      String(commit.fileChanged || "")
        .toLowerCase()
        .includes(search) ||
      String(commit.repositoryLink || "")
        .toLowerCase()
        .includes(search) ||
      String(commit.commitDate || "")
        .toLowerCase()
        .includes(search) ||
      String(commit.taskId || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const totalCommits = commits.length;

  const uniqueTasks = new Set(
    commits
      .map((commit) => commit.taskId)
      .filter(
        (taskId) =>
          taskId !== null && taskId !== undefined
      )
  ).size;

  const uniqueRepositories = new Set(
    commits
      .map((commit) => commit.repositoryLink)
      .filter(Boolean)
  ).size;

  return (
    <div className="code-commits-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div className="page-header-left">

          <p className="eyebrow">
            SOURCE CONTROL
          </p>

          <h1>
            Code Commits
          </h1>

          <p>
            Track and manage project code commits.
          </p>

        </div>

        <div className="header-stat">

          <span>
            Total Commits
          </span>

          <strong>
            {totalCommits}
          </strong>

        </div>

      </div>

      {/* MESSAGES */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* SUMMARY */}

      <div className="commit-summary">

        <div className="commit-summary-card">
          <span>Total Commits</span>
          <strong>{totalCommits}</strong>
        </div>

        <div className="commit-summary-card">
          <span>Tasks Connected</span>
          <strong>{uniqueTasks}</strong>
        </div>

        <div className="commit-summary-card">
          <span>Repositories</span>
          <strong>{uniqueRepositories}</strong>
        </div>

      </div>

      {/* FORM */}

      <div className="form-card">

        <div className="form-card-header">

          <div>

            <h2>
              {editingId !== null
                ? "Update Code Commit"
                : "Add New Code Commit"}
            </h2>

            <p>
              {editingId !== null
                ? "Update the selected commit information."
                : "Enter the details of a project code commit."}
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">

              <label htmlFor="commitMessage">
                Commit Message
              </label>

              <input
                id="commitMessage"
                type="text"
                name="commitMessage"
                value={form.commitMessage}
                onChange={handleChange}
                placeholder="Enter commit message"
                maxLength="500"
              />

            </div>

            <div className="form-group">

              <label htmlFor="fileChanged">
                File Changed
              </label>

              <input
                id="fileChanged"
                type="text"
                name="fileChanged"
                value={form.fileChanged}
                onChange={handleChange}
                placeholder="Example: LoginController.java"
                maxLength="255"
              />

            </div>

            <div className="form-group">

              <label htmlFor="repositoryLink">
                Repository Link
              </label>

              <input
                id="repositoryLink"
                type="url"
                name="repositoryLink"
                value={form.repositoryLink}
                onChange={handleChange}
                placeholder="https://github.com/..."
                maxLength="500"
              />

            </div>

            <div className="form-group">

              <label htmlFor="commitDate">
                Commit Date
              </label>

              <input
                id="commitDate"
                type="date"
                name="commitDate"
                value={form.commitDate}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label htmlFor="taskId">
                Task ID
              </label>

              <input
                id="taskId"
                type="number"
                name="taskId"
                value={form.taskId}
                onChange={handleChange}
                placeholder="Enter task ID"
                min="1"
              />

            </div>

          </div>

          <div className="form-actions">

            {editingId !== null && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Commit"
                : "Create Commit"}
            </button>

          </div>

        </form>

      </div>

      {/* LIST */}

      <div className="commit-list-card">

        <div className="commit-list-header">

          <div className="commit-list-title">

            <h2>
              Code Commit List
            </h2>

            <p>
              View and manage all project commits.
            </p>

          </div>

          <div className="commit-list-actions">

            <div className="commit-search">

              <input
                type="text"
                placeholder="Search commits..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

            <button
              type="button"
              className="secondary-btn"
              onClick={loadCommits}
              disabled={loading}
            >
              Refresh
            </button>

          </div>

        </div>

        {loading ? (

          <div className="loading-state">
            Loading code commits...
          </div>

        ) : filteredCommits.length === 0 ? (

          <div className="empty-state">

            {searchTerm
              ? "No code commits match your search."
              : "No code commits available."}

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Commit ID</th>
                  <th>Commit Message</th>
                  <th>File Changed</th>
                  <th>Repository</th>
                  <th>Commit Date</th>
                  <th>Task ID</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredCommits.map((commit) => (

                  <tr key={commit.commitId}>

                    <td>
                      <span className="commit-id-badge">
                        #{commit.commitId}
                      </span>
                    </td>

                    <td>
                      <div className="commit-message-cell">
                        <strong>
                          {commit.commitMessage || "-"}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="file-name">
                        {commit.fileChanged || "-"}
                      </span>
                    </td>

                    <td>

                      {commit.repositoryLink ? (

                        <a
                          href={commit.repositoryLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="commit-repository-link"
                        >
                          Open Repository
                        </a>

                      ) : (
                        "-"
                      )}

                    </td>

                    <td>
                      <span className="commit-date">
                        {commit.commitDate || "-"}
                      </span>
                    </td>

                    <td>
                      <span className="task-id-badge">
                        Task {commit.taskId || "-"}
                      </span>
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="action-btn edit-btn"
                          onClick={() =>
                            handleEdit(commit)
                          }
                          title="Edit Commit"
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() =>
                            handleDelete(
                              commit.commitId
                            )
                          }
                          title="Delete Commit"
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default CodeCommits;
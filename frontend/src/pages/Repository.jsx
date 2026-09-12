import { useEffect, useState } from "react";
import {
  getRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
} from "../services/api";

function Repository() {
  const emptyForm = {
    repositoryName: "",
    repositoryUrl: "",
    branch: "main",
    projectId: "",
  };

  const [repositories, setRepositories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // =====================================
  // LOAD REPOSITORIES
  // =====================================

  const loadRepositories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRepositories();

      // getRepositories() already returns response.data
      setRepositories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading repositories:", err);
      setError("Unable to load repositories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // VALIDATION
  // =====================================

  const validateForm = () => {
    if (!form.repositoryName.trim()) {
      setError("Repository name is required.");
      return false;
    }

    if (!form.repositoryUrl.trim()) {
      setError("Repository URL is required.");
      return false;
    }

    if (!form.branch.trim()) {
      setError("Branch is required.");
      return false;
    }

    if (!form.projectId) {
      setError("Project ID is required.");
      return false;
    }

    return true;
  };

  // =====================================
  // CREATE / UPDATE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    const repositoryData = {
      repositoryName: form.repositoryName.trim(),
      repositoryUrl: form.repositoryUrl.trim(),
      branch: form.branch.trim(),
      projectId: Number(form.projectId),
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateRepository(editingId, repositoryData);
        setMessage("Repository updated successfully.");
      } else {
        await createRepository(repositoryData);
        setMessage("Repository created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadRepositories();
    } catch (err) {
      console.error("Error saving repository:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to save repository. Please check your details.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // EDIT
  // =====================================

  const handleEdit = (repository) => {
    setEditingId(repository.repositoryId);

    setForm({
      repositoryName: repository.repositoryName || "",
      repositoryUrl: repository.repositoryUrl || "",
      branch: repository.branch || "main",
      projectId:
        repository.projectId !== null &&
        repository.projectId !== undefined
          ? String(repository.projectId)
          : "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // DELETE
  // =====================================

  const handleDelete = async (repositoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this repository?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteRepository(repositoryId);

      setMessage("Repository deleted successfully.");

      if (editingId === repositoryId) {
        setEditingId(null);
        setForm(emptyForm);
      }

      await loadRepositories();
    } catch (err) {
      console.error("Error deleting repository:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to delete repository.");
      }
    }
  };

  // =====================================
  // CANCEL EDIT
  // =====================================

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredRepositories = repositories.filter((repository) => {
    const search = searchTerm.toLowerCase();

    return (
      String(repository.repositoryId || "")
        .toLowerCase()
        .includes(search) ||
      String(repository.repositoryName || "")
        .toLowerCase()
        .includes(search) ||
      String(repository.branch || "")
        .toLowerCase()
        .includes(search) ||
      String(repository.projectId || "")
        .toLowerCase()
        .includes(search) ||
      String(repository.repositoryUrl || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // =====================================
  // SUMMARY
  // =====================================

  const totalRepositories = repositories.length;

  const mainRepositories = repositories.filter(
    (repository) =>
      String(repository.branch || "").toLowerCase() === "main"
  ).length;

  const developRepositories = repositories.filter(
    (repository) =>
      String(repository.branch || "").toLowerCase() === "develop"
  ).length;

  const uniqueProjects = new Set(
    repositories
      .map((repository) => repository.projectId)
      .filter(
        (projectId) =>
          projectId !== null && projectId !== undefined
      )
  ).size;

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="repository-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div className="page-header-left">

          <p className="eyebrow">
            SOURCE CONTROL
          </p>

          <h1>
            Repositories
          </h1>

          <p>
            Manage project repositories, branches and source code locations.
          </p>

        </div>

        <div className="header-stat">

          <span>
            Total Repositories
          </span>

          <strong>
            {totalRepositories}
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

      {/* SUMMARY CARDS */}

      <div className="repository-summary">

        <div className="repository-summary-card">
          <span>Total Repositories</span>
          <strong>{totalRepositories}</strong>
        </div>

        <div className="repository-summary-card">
          <span>Main Branch</span>
          <strong>{mainRepositories}</strong>
        </div>

        <div className="repository-summary-card">
          <span>Develop Branch</span>
          <strong>{developRepositories}</strong>
        </div>

        <div className="repository-summary-card">
          <span>Projects Connected</span>
          <strong>{uniqueProjects}</strong>
        </div>

      </div>

      {/* CREATE / UPDATE FORM */}

      <div className="form-card">

        <div className="form-card-header">

          <div>

            <h2>
              {editingId
                ? "Update Repository"
                : "Add New Repository"}
            </h2>

            <p>
              {editingId
                ? "Update the repository information below."
                : "Enter repository details to connect it with a project."}
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* REPOSITORY NAME */}

            <div className="form-group">

              <label htmlFor="repositoryName">
                Repository Name
              </label>

              <input
                id="repositoryName"
                type="text"
                name="repositoryName"
                value={form.repositoryName}
                onChange={handleChange}
                placeholder="Enter repository name"
              />

            </div>

            {/* REPOSITORY URL */}

            <div className="form-group">

              <label htmlFor="repositoryUrl">
                Repository URL
              </label>

              <input
                id="repositoryUrl"
                type="text"
                name="repositoryUrl"
                value={form.repositoryUrl}
                onChange={handleChange}
                placeholder="https://github.com/example/repository"
              />

            </div>

            {/* BRANCH */}

            <div className="form-group">

              <label htmlFor="branch">
                Branch
              </label>

              <select
                id="branch"
                name="branch"
                value={form.branch}
                onChange={handleChange}
              >
                <option value="main">
                  main
                </option>

                <option value="develop">
                  develop
                </option>

                <option value="feature">
                  feature
                </option>

                <option value="testing">
                  testing
                </option>

              </select>

            </div>

            {/* PROJECT ID */}

            <div className="form-group">

              <label htmlFor="projectId">
                Project ID
              </label>

              <input
                id="projectId"
                type="number"
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                placeholder="Enter project ID"
                min="1"
              />

            </div>

          </div>

          {/* FORM BUTTONS */}

          <div className="form-actions">

            {editingId && (
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
                : editingId
                ? "Update Repository"
                : "Create Repository"}
            </button>

          </div>

        </form>

      </div>

      {/* REPOSITORY LIST */}

      <div className="repository-list-card">

        <div className="repository-list-header">

          <div className="repository-list-title">

            <h2>
              Repository List
            </h2>

            <p>
              View and manage all connected repositories.
            </p>

          </div>

          <div className="repository-search">

            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="loading-state">
            Loading repositories...
          </div>

        ) : filteredRepositories.length === 0 ? (

          <div className="empty-state">

            {searchTerm
              ? "No repositories match your search."
              : "No repositories available."}

          </div>

        ) : (

          /* TABLE */

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Repository ID
                  </th>

                  <th>
                    Repository
                  </th>

                  <th>
                    Branch
                  </th>

                  <th>
                    Project ID
                  </th>

                  <th>
                    Repository URL
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRepositories.map(
                  (repository) => (

                    <tr
                      key={repository.repositoryId}
                    >

                      {/* ID */}

                      <td>

                        <span className="repository-id-badge">
                          #{repository.repositoryId}
                        </span>

                      </td>

                      {/* REPOSITORY */}

                      <td>

                        <div className="repository-name-cell">

                          <div>

                            <strong>
                              {repository.repositoryName}
                            </strong>

                            <span>
                              Source code repository
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* BRANCH */}

                      <td>

                        <span className="branch-badge">
                          {repository.branch}
                        </span>

                      </td>

                      {/* PROJECT */}

                      <td>

                        <span className="project-id-badge">
                          Project {repository.projectId}
                        </span>

                      </td>

                      {/* URL */}

                      <td>

                        {repository.repositoryUrl ? (

                          <a
                            href={repository.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="repository-url"
                          >
                            {repository.repositoryUrl}
                          </a>

                        ) : (

                          <span>
                            -
                          </span>

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="action-btn edit-btn"
                            onClick={() =>
                              handleEdit(repository)
                            }
                            title="Edit Repository"
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() =>
                              handleDelete(
                                repository.repositoryId
                              )
                            }
                            title="Delete Repository"
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Repository;
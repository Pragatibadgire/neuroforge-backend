import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planning",
    managerId: 2,
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // GET PROJECTS
  // =========================

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data);
    } catch (error) {
      console.error("GET PROJECTS ERROR:", error);

      setError(
        error.message || "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      const projectData = {
        projectName: form.projectName,
        description: form.description,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        status: form.status,
        managerId: Number(form.managerId),
      };

      if (editingId) {
        await updateProject(editingId, projectData);
        setMessage("Project updated successfully.");
      } else {
        await createProject(projectData);
        setMessage("Project created successfully.");
      }

      setForm({
        projectName: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Planning",
        managerId: 2,
      });

      setEditingId(null);

      await loadProjects();
    } catch (error) {
      console.error("SAVE PROJECT ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to save project."
      );
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (project) => {
    setEditingId(project.projectId);

    setForm({
      projectName: project.projectName || "",
      description: project.description || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      status: project.status || "Planning",
      managerId: project.managerId || 2,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteProject(id);

      setMessage("Project deleted successfully.");

      await loadProjects();
    } catch (error) {
      console.error("DELETE PROJECT ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete project."
      );
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Planning",
      managerId: 2,
    });

    setError("");
    setMessage("");
  };

  // =========================
  // SEARCH
  // =========================

  const filteredProjects = projects.filter((project) => {
    const search = searchTerm.toLowerCase();

    return (
      project.projectName
        ?.toLowerCase()
        .includes(search) ||
      project.description
        ?.toLowerCase()
        .includes(search) ||
      project.status
        ?.toLowerCase()
        .includes(search)
    );
  });

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "project-status completed";

      case "in progress":
        return "project-status progress";

      case "planning":
        return "project-status planning";

      case "on hold":
        return "project-status hold";

      default:
        return "project-status";
    }
  };

  // =========================
  // COUNTS
  // =========================

  const planningCount = projects.filter(
    (project) =>
      project.status?.toLowerCase() === "planning"
  ).length;

  const progressCount = projects.filter(
    (project) =>
      project.status?.toLowerCase() === "in progress"
  ).length;

  const completedCount = projects.filter(
    (project) =>
      project.status?.toLowerCase() === "completed"
  ).length;

  return (
    <div className="projects-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="projects-page-header">

        <div>
          <div className="projects-breadcrumb">
            Project Management
          </div>

          <h1>Projects</h1>

          <p>
            Create, manage and track all your
            software development projects.
          </p>
        </div>

        <div className="projects-header-stats">

          <div className="mini-project-stat">
            <strong>{projects.length}</strong>
            <span>Total</span>
          </div>

          <div className="mini-project-stat">
            <strong>{progressCount}</strong>
            <span>Active</span>
          </div>

        </div>

      </div>


      {/* ======================================
          MESSAGES
      ====================================== */}

      {message && (
        <div className="project-alert success-alert">
          <span>✓</span>
          {message}
        </div>
      )}

      {error && (
        <div className="project-alert error-alert">
          <span>!</span>
          {error}
        </div>
      )}


      {/* ======================================
          PROJECT FORM
      ====================================== */}

      <div className="project-form-card">

        <div className="project-form-header">

          <div className="form-title-icon">
            {editingId ? "✎" : "+"}
          </div>

          <div>
            <h2>
              {editingId
                ? "Update Project"
                : "Create New Project"}
            </h2>

            <p>
              {editingId
                ? "Update the project information below."
                : "Add a new project to your workspace."}
            </p>
          </div>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="project-form-grid">

            <div className="project-form-group project-name-field">

              <label>Project Name *</label>

              <input
                type="text"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="e.g. NeuroForge Enterprise SDLC"
              />

            </div>


            <div className="project-form-group">

              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Planning">
                  Planning
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

            </div>


            <div className="project-form-group">

              <label>Start Date</label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />

            </div>


            <div className="project-form-group">

              <label>End Date</label>

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />

            </div>


            <div className="project-form-group">

              <label>Manager ID</label>

              <input
                type="number"
                name="managerId"
                value={form.managerId}
                onChange={handleChange}
                min="1"
              />

            </div>


            <div className="project-form-group project-description-field">

              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the purpose and goals of this project..."
                rows="3"
              />

            </div>

          </div>


          <div className="project-form-actions">

            {editingId && (
              <button
                type="button"
                className="project-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="project-submit-btn"
            >
              <span>{editingId ? "✓" : "+"}</span>

              {editingId
                ? "Update Project"
                : "Create Project"}
            </button>

          </div>

        </form>

      </div>


      {/* ======================================
          PROJECT LIST HEADER
      ====================================== */}

      <div className="project-list-card">

        <div className="project-list-header">

          <div>

            <h2>All Projects</h2>

            <p>
              {projects.length} projects in your
              workspace
            </p>

          </div>


          <div className="project-list-actions">

            <div className="project-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>


            <button
              className="project-refresh-btn"
              onClick={loadProjects}
              title="Refresh projects"
            >
              ↻
            </button>

          </div>

        </div>


        {/* ======================================
            PROJECT SUMMARY
        ====================================== */}

        <div className="project-summary-row">

          <div className="project-summary-item">
            <span className="summary-dot all-dot"></span>
            <span>Total</span>
            <strong>{projects.length}</strong>
          </div>

          <div className="project-summary-item">
            <span className="summary-dot planning-dot"></span>
            <span>Planning</span>
            <strong>{planningCount}</strong>
          </div>

          <div className="project-summary-item">
            <span className="summary-dot progress-dot"></span>
            <span>In Progress</span>
            <strong>{progressCount}</strong>
          </div>

          <div className="project-summary-item">
            <span className="summary-dot completed-dot"></span>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>

        </div>


        {/* ======================================
            PROJECT TABLE
        ====================================== */}

        {loading ? (

          <div className="project-loading">
            <div className="loading-spinner"></div>
            <span>Loading projects...</span>
          </div>

        ) : filteredProjects.length === 0 ? (

          <div className="project-empty">

            <div className="empty-project-icon">
              ▣
            </div>

            <h3>
              {searchTerm
                ? "No matching projects"
                : "No projects found"}
            </h3>

            <p>
              {searchTerm
                ? "Try a different search term."
                : "Create your first project to get started."}
            </p>

          </div>

        ) : (

          <div className="projects-table-wrapper">

            <table className="projects-table">

              <thead>

                <tr>
                  <th>PROJECT</th>
                  <th>STATUS</th>
                  <th>START DATE</th>
                  <th>END DATE</th>
                  <th>MANAGER</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>


              <tbody>

                {filteredProjects.map((project) => (

                  <tr
                    key={project.projectId}
                  >

                    <td>

                      <div className="project-table-name">

                        <div className="project-table-icon">
                          ▣
                        </div>

                        <div>

                          <strong>
                            {project.projectName}
                          </strong>

                          <span>
                            Project #{project.projectId}
                          </span>

                        </div>

                      </div>

                      <div className="project-table-description">
                        {project.description || "No description provided"}
                      </div>

                    </td>


                    <td>

                      <span
                        className={getStatusClass(
                          project.status
                        )}
                      >
                        <span className="status-indicator"></span>
                        {project.status}
                      </span>

                    </td>


                    <td>
                      {project.startDate || "-"}
                    </td>


                    <td>
                      {project.endDate || "-"}
                    </td>


                    <td>

                      <div className="manager-cell">

                        <div className="manager-avatar">
                          M
                        </div>

                        <span>
                          Manager #{project.managerId || "-"}
                        </span>

                      </div>

                    </td>


                    <td>

                      <div className="project-action-buttons">

                        <button
                          className="project-edit-btn"
                          onClick={() =>
                            handleEdit(project)
                          }
                          title="Edit project"
                        >
                          ✎
                        </button>

                        <button
                          className="project-delete-btn"
                          onClick={() =>
                            handleDelete(
                              project.projectId
                            )
                          }
                          title="Delete project"
                        >
                          ×
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

export default Projects;
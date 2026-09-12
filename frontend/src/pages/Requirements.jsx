import { useEffect, useState } from "react";
import {
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
} from "../services/api";

function Requirements() {
  const emptyForm = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Proposed",
    projectId: "",
  };

  const [requirements, setRequirements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // LOAD REQUIREMENTS
  // ==========================================

  const loadRequirements = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRequirements();

      console.log("Requirements received:", data);

      setRequirements(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "GET REQUIREMENTS ERROR:",
        err
      );

      const backendError =
        err.response?.data;

      let errorMessage =
        "Unable to load requirements.";

      if (backendError?.message) {
        errorMessage =
          backendError.message;
      } else if (backendError?.error) {
        errorMessage =
          backendError.error;
      } else if (
        typeof backendError === "string"
      ) {
        errorMessage =
          backendError;
      } else if (err.message) {
        errorMessage =
          err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequirements();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // TITLE VALIDATION

    if (!form.title.trim()) {
      setError(
        "Requirement title is required."
      );
      return;
    }

    if (form.title.trim().length < 3) {
      setError(
        "Requirement title must contain at least 3 characters."
      );
      return;
    }

    // DESCRIPTION VALIDATION

    if (!form.description.trim()) {
      setError(
        "Requirement description is required."
      );
      return;
    }

    // PROJECT ID VALIDATION

    if (!form.projectId) {
      setError(
        "Project ID is required."
      );
      return;
    }

    if (Number(form.projectId) <= 0) {
      setError(
        "Project ID must be greater than 0."
      );
      return;
    }

    try {
      setSaving(true);

      const requirementData = {
        title: form.title.trim(),
        description:
          form.description.trim(),
        priority: form.priority,
        status: form.status,
        projectId: Number(
          form.projectId
        ),
      };

      console.log(
        "Requirement being sent:",
        requirementData
      );

      // UPDATE

      if (editingId !== null) {
        await updateRequirement(
          editingId,
          requirementData
        );

        setMessage(
          "Requirement updated successfully."
        );
      }

      // CREATE

      else {
        await createRequirement(
          requirementData
        );

        setMessage(
          "Requirement created successfully."
        );
      }

      // RESET FORM

      setForm(emptyForm);
      setEditingId(null);

      // RELOAD REQUIREMENTS

      await loadRequirements();

    } catch (err) {
      console.error(
        "SAVE REQUIREMENT ERROR:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      const backendError =
        err.response?.data;

      let errorMessage =
        "Unable to save requirement.";

      if (backendError?.message) {
        errorMessage =
          backendError.message;
      } else if (backendError?.error) {
        errorMessage =
          backendError.error;
      } else if (
        typeof backendError === "string"
      ) {
        errorMessage =
          backendError;
      } else if (err.message) {
        errorMessage =
          err.message;
      }

      setError(errorMessage);

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (requirement) => {
    setEditingId(
      requirement.requirementId
    );

    setForm({
      title:
        requirement.title || "",

      description:
        requirement.description || "",

      priority:
        requirement.priority ||
        "Medium",

      status:
        requirement.status ||
        "Proposed",

      projectId:
        requirement.projectId || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this requirement?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteRequirement(id);

      setMessage(
        "Requirement deleted successfully."
      );

      await loadRequirements();

    } catch (err) {
      console.error(
        "DELETE REQUIREMENT ERROR:",
        err
      );

      const backendError =
        err.response?.data;

      let errorMessage =
        "Unable to delete requirement.";

      if (backendError?.message) {
        errorMessage =
          backendError.message;
      } else if (backendError?.error) {
        errorMessage =
          backendError.error;
      } else if (
        typeof backendError === "string"
      ) {
        errorMessage =
          backendError;
      } else if (err.message) {
        errorMessage =
          err.message;
      }

      setError(errorMessage);
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setEditingId(null);

    setForm(emptyForm);

    setMessage("");
    setError("");
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredRequirements =
    requirements.filter(
      (requirement) => {
        const search =
          searchTerm.toLowerCase();

        return (
          requirement.title
            ?.toLowerCase()
            .includes(search) ||

          requirement.description
            ?.toLowerCase()
            .includes(search) ||

          requirement.priority
            ?.toLowerCase()
            .includes(search) ||

          requirement.status
            ?.toLowerCase()
            .includes(search) ||

          String(
            requirement.projectId
          )
            .toLowerCase()
            .includes(search)
        );
      }
    );

  // ==========================================
  // SUMMARY COUNTS
  // ==========================================

  const proposedCount =
    requirements.filter(
      (item) =>
        item.status === "Proposed"
    ).length;

  const approvedCount =
    requirements.filter(
      (item) =>
        item.status === "Approved"
    ).length;

  const inProgressCount =
    requirements.filter(
      (item) =>
        item.status === "In Progress"
    ).length;

  const completedCount =
    requirements.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-badge status-completed";

      case "In Progress":
        return "status-badge status-progress";

      case "Approved":
        return "status-badge status-approved";

      case "Rejected":
        return "status-badge status-rejected";

      case "Proposed":
      default:
        return "status-badge status-proposed";
    }
  };

  // ==========================================
  // PRIORITY CLASS
  // ==========================================

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Critical":
        return "priority-badge priority-critical";

      case "High":
        return "priority-badge priority-high";

      case "Low":
        return "priority-badge priority-low";

      case "Medium":
      default:
        return "priority-badge priority-medium";
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page requirements-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-header requirements-header">

        <div>

          <span className="page-eyebrow">
            REQUIREMENTS MANAGEMENT
          </span>

          <h1>
            Requirements
          </h1>

          <p>
            Define, organize and track
            project requirements
            throughout the SDLC.
          </p>

        </div>

        <div className="header-stat-box">

          <span>
            Total Requirements
          </span>

          <strong>
            {requirements.length}
          </strong>

        </div>

      </div>


      {/* =====================================
          SUCCESS MESSAGE
      ===================================== */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}


      {/* =====================================
          ERROR MESSAGE
      ===================================== */}

      {error && (
        <div className="error-message">
          ⚠ {error}
        </div>
      )}


      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="requirements-summary">

        <div className="requirement-stat-card">

          <div className="requirement-stat-icon">
            ▤
          </div>

          <div>
            <span>
              Total
            </span>

            <strong>
              {requirements.length}
            </strong>
          </div>

        </div>


        <div className="requirement-stat-card">

          <div className="requirement-stat-icon proposed">
            ◌
          </div>

          <div>
            <span>
              Proposed
            </span>

            <strong>
              {proposedCount}
            </strong>
          </div>

        </div>


        <div className="requirement-stat-card">

          <div className="requirement-stat-icon approved">
            ✓
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              {approvedCount}
            </strong>
          </div>

        </div>


        <div className="requirement-stat-card">

          <div className="requirement-stat-icon progress">
            ↗
          </div>

          <div>
            <span>
              In Progress
            </span>

            <strong>
              {inProgressCount}
            </strong>
          </div>

        </div>


        <div className="requirement-stat-card">

          <div className="requirement-stat-icon completed">
            ✓
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {completedCount}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================
          ADD / UPDATE REQUIREMENT
      ===================================== */}

      <div className="crud-card requirement-form-card">

        <div className="card-heading">

          <div>

            <span className="card-eyebrow">
              REQUIREMENT DETAILS
            </span>

            <h2>

              {editingId !== null
                ? "Update Requirement"
                : "Add New Requirement"}

            </h2>

            <p>

              {editingId !== null
                ? "Modify the selected requirement."
                : "Create a requirement and associate it with a project."}

            </p>

          </div>


          {editingId !== null && (

            <div className="editing-indicator">

              Editing #{editingId}

            </div>

          )}

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* TITLE */}

            <div className="form-group form-group-wide">

              <label>
                Requirement Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. User authentication and login"
                maxLength="200"
              />

              <small>
                Minimum 3 characters
              </small>

            </div>


            {/* PROJECT ID */}

            <div className="form-group">

              <label>
                Project ID *
              </label>

              <input
                type="number"
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                placeholder="e.g. 1"
                min="1"
              />

            </div>


            {/* PRIORITY */}

            <div className="form-group">

              <label>
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Critical">
                  Critical
                </option>

              </select>

            </div>


            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="Proposed">
                  Proposed
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>


            {/* DESCRIPTION */}

            <div className="form-group form-group-wide">

              <label>
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what the system should do..."
                rows="4"
                maxLength="500"
              />

              <small>
                Maximum 500 characters
              </small>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="form-actions">

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Requirement"
                : "Create Requirement"}

            </button>


            {editingId !== null && (

              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* =====================================
          REQUIREMENT LIST
      ===================================== */}

      <div className="crud-card requirement-list-card">

        <div className="card-heading requirement-list-heading">

          <div>

            <span className="card-eyebrow">
              PROJECT REQUIREMENTS
            </span>

            <h2>
              Requirement List
            </h2>

            <p>
              {filteredRequirements.length} of{" "}
              {requirements.length} requirements
              displayed
            </p>

          </div>


          <div className="requirement-list-actions">

            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>


            <button
              className="secondary-btn"
              onClick={loadRequirements}
              disabled={loading}
            >
              ↻ Refresh
            </button>

          </div>

        </div>


        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (

          <div className="loading">
            Loading requirements...
          </div>

        )}


        {/* =====================================
            TABLE
        ===================================== */}

        {!loading &&
          filteredRequirements.length > 0 && (

            <div className="table-container requirements-table-container">

              <table className="requirements-table">

                <thead>

                  <tr>

                    <th>
                      Requirement ID
                    </th>

                    <th>
                      Requirement
                    </th>

                    <th>
                      Project ID
                    </th>

                    <th>
                      Priority
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredRequirements.map(
                    (requirement) => (

                      <tr
                        key={
                          requirement.requirementId
                        }
                      >

                        {/* REQUIREMENT ID */}

                        <td>

                          <span className="id-badge">

                            {
                              requirement.requirementId
                            }

                          </span>

                        </td>


                        {/* REQUIREMENT */}

                        <td className="requirement-title-cell">

                          <strong>
                            {
                              requirement.title
                            }
                          </strong>

                          <span>
                            {
                              requirement.description ||
                              "No description"
                            }
                          </span>

                        </td>


                        {/* PROJECT ID */}

                        <td>

                          <span className="project-id-badge">

                            {
                              requirement.projectId ||
                              "-"
                            }

                          </span>

                        </td>


                        {/* PRIORITY */}

                        <td>

                          <span
                            className={getPriorityClass(
                              requirement.priority
                            )}
                          >

                            {
                              requirement.priority ||
                              "-"
                            }

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={getStatusClass(
                              requirement.status
                            )}
                          >

                            {
                              requirement.status ||
                              "-"
                            }

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">

                            <button
                              className="table-action edit"
                              onClick={() =>
                                handleEdit(
                                  requirement
                                )
                              }
                              title="Edit requirement"
                            >
                              ✎
                            </button>


                            <button
                              className="table-action delete"
                              onClick={() =>
                                handleDelete(
                                  requirement.requirementId
                                )
                              }
                              title="Delete requirement"
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


        {/* =====================================
            EMPTY / NO SEARCH RESULT
        ===================================== */}

        {!loading &&
          filteredRequirements.length === 0 && (

            <div className="empty-message">

              {searchTerm ? (
                <>
                  <h3>
                    No matching requirements
                  </h3>

                  <p>
                    Try a different search term.
                  </p>
                </>
              ) : (
                <>
                  <h3>
                    No requirements found
                  </h3>

                  <p>
                    Add your first requirement
                    using the form above.
                  </p>
                </>
              )}

            </div>

          )}

      </div>

    </div>
  );
}

export default Requirements;
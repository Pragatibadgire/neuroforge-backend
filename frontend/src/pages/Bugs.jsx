import { useEffect, useState } from "react";
import {
  getBugs,
  createBug,
  updateBug,
  deleteBug,
} from "../services/api";

function Bugs() {
  const emptyForm = {
    bugTitle: "",
    description: "",
    reportedDate: "",
    severity: "Low",
    status: "Open",
    testcaseId: "",
  };

  const [bugs, setBugs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // LOAD BUGS
  // ==========================================

  const loadBugs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBugs();

      setBugs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET BUGS ERROR:", err);

      const backendError = err.response?.data;

      let errorMessage = "Unable to load bugs.";

      if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (backendError?.error) {
        errorMessage = backendError.error;
      } else if (typeof backendError === "string") {
        errorMessage = backendError;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBugs();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.bugTitle.trim()) {
      setError("Bug title is required.");
      return;
    }

    if (form.bugTitle.trim().length < 2) {
      setError("Bug title must contain at least 2 characters.");
      return;
    }

    if (!form.description.trim()) {
      setError("Bug description is required.");
      return;
    }

    if (!form.reportedDate) {
      setError("Reported date is required.");
      return;
    }

    if (!form.severity) {
      setError("Severity is required.");
      return;
    }

    if (!form.status) {
      setError("Status is required.");
      return;
    }

    if (!form.testcaseId) {
      setError("Test Case ID is required.");
      return;
    }

    if (Number(form.testcaseId) <= 0) {
      setError("Test Case ID must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const bugData = {
        bugTitle: form.bugTitle.trim(),
        description: form.description.trim(),
        reportedDate: form.reportedDate,
        severity: form.severity,
        status: form.status,
        testcaseId: Number(form.testcaseId),
      };

      if (editingId !== null) {
        await updateBug(editingId, bugData);

        setMessage("Bug updated successfully.");
      } else {
        await createBug(bugData);

        setMessage("Bug created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadBugs();
    } catch (err) {
      console.error("SAVE BUG ERROR:", err);

      const backendError = err.response?.data;

      let errorMessage = "Unable to save bug.";

      if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (backendError?.error) {
        errorMessage = backendError.error;
      } else if (typeof backendError === "string") {
        errorMessage = backendError;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (bug) => {
    setEditingId(bug.bugId);

    setForm({
      bugTitle: bug.bugTitle || "",
      description: bug.description || "",
      reportedDate: bug.reportedDate || "",
      severity: bug.severity || "Low",
      status: bug.status || "Open",
      testcaseId: bug.testcaseId || "",
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this bug?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteBug(id);

      setMessage("Bug deleted successfully.");

      await loadBugs();
    } catch (err) {
      console.error("DELETE BUG ERROR:", err);

      const backendError = err.response?.data;

      let errorMessage = "Unable to delete bug.";

      if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (backendError?.error) {
        errorMessage = backendError.error;
      } else if (typeof backendError === "string") {
        errorMessage = backendError;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  // ==========================================
  // CANCEL
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

  const filteredBugs = bugs.filter((bug) => {
    const search = searchTerm.toLowerCase();

    return (
      String(bug.bugId || "")
        .toLowerCase()
        .includes(search) ||
      String(bug.bugTitle || "")
        .toLowerCase()
        .includes(search) ||
      String(bug.description || "")
        .toLowerCase()
        .includes(search) ||
      String(bug.severity || "")
        .toLowerCase()
        .includes(search) ||
      String(bug.status || "")
        .toLowerCase()
        .includes(search) ||
      String(bug.testcaseId || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // ==========================================
  // SUMMARY
  // ==========================================

  const openCount = bugs.filter(
    (bug) => bug.status === "Open"
  ).length;

  const inProgressCount = bugs.filter(
    (bug) => bug.status === "In Progress"
  ).length;

  const criticalCount = bugs.filter(
    (bug) => bug.severity === "Critical"
  ).length;

  const resolvedCount = bugs.filter(
    (bug) =>
      bug.status === "Resolved" ||
      bug.status === "Closed"
  ).length;

  // ==========================================
  // SEVERITY CLASS
  // ==========================================

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Critical":
        return "bug-severity bug-critical";

      case "High":
        return "bug-severity bug-high";

      case "Medium":
        return "bug-severity bug-medium";

      case "Low":
        return "bug-severity bug-low";

      default:
        return "bug-severity bug-low";
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "bug-status bug-status-open";

      case "In Progress":
        return "bug-status bug-status-progress";

      case "Resolved":
        return "bug-status bug-status-resolved";

      case "Closed":
        return "bug-status bug-status-closed";

      default:
        return "bug-status bug-status-open";
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page bugs-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <span className="page-eyebrow">
            QUALITY ASSURANCE
          </span>

          <h1>Bugs</h1>

          <p>
            Report, track and manage software bugs.
          </p>
        </div>

        <div className="page-header-stat">
          <span>Total Bugs</span>
          <strong>{bugs.length}</strong>
        </div>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="summary-grid">

        {/* TOTAL */}

        <div className="summary-card">

          <div className="summary-card-top">

            <span className="summary-label">
              Total Bugs
            </span>

            <div className="summary-icon summary-blue">
              !
            </div>

          </div>

          <strong>{bugs.length}</strong>

          <span className="summary-description">
            All reported bugs
          </span>

        </div>

        {/* OPEN */}

        <div className="summary-card">

          <div className="summary-card-top">

            <span className="summary-label">
              Open
            </span>

            <div className="summary-icon summary-red">
              !
            </div>

          </div>

          <strong>{openCount}</strong>

          <span className="summary-description">
            Bugs awaiting action
          </span>

        </div>

        {/* IN PROGRESS */}

        <div className="summary-card">

          <div className="summary-card-top">

            <span className="summary-label">
              In Progress
            </span>

            <div className="summary-icon summary-yellow">
              ◌
            </div>

          </div>

          <strong>{inProgressCount}</strong>

          <span className="summary-description">
            Bugs being worked on
          </span>

        </div>

        {/* RESOLVED */}

        <div className="summary-card">

          <div className="summary-card-top">

            <span className="summary-label">
              Resolved
            </span>

            <div className="summary-icon summary-green">
              ✓
            </div>

          </div>

          <strong>{resolvedCount}</strong>

          <span className="summary-description">
            Resolved or closed bugs
          </span>

        </div>

      </div>

      {/* FORM CARD */}

      <div className="crud-card bug-form-card">

        <div className="card-heading">

          <div>

            <span className="card-eyebrow">
              BUG MANAGEMENT
            </span>

            <h2>
              {editingId !== null
                ? "Update Bug"
                : "Report New Bug"}
            </h2>

            <p>
              {editingId !== null
                ? "Update the selected bug details."
                : "Enter the details below to report a new software bug."}
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* BUG TITLE */}

            <div className="form-group form-full">

              <label>
                Bug Title <span>*</span>
              </label>

              <input
                type="text"
                name="bugTitle"
                value={form.bugTitle}
                onChange={handleChange}
                placeholder="Enter a clear bug title"
                maxLength="200"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group form-full">

              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue, observed behavior and relevant details"
                rows="4"
              />

            </div>

            {/* REPORTED DATE */}

            <div className="form-group">

              <label>
                Reported Date <span>*</span>
              </label>

              <input
                type="date"
                name="reportedDate"
                value={form.reportedDate}
                onChange={handleChange}
              />

            </div>

            {/* TEST CASE ID */}

            <div className="form-group">

              <label>
                Test Case ID <span>*</span>
              </label>

              <input
                type="number"
                name="testcaseId"
                value={form.testcaseId}
                onChange={handleChange}
                placeholder="Enter test case ID"
                min="1"
              />

            </div>

            {/* SEVERITY */}

            <div className="form-group">

              <label>
                Severity <span>*</span>
              </label>

              <select
                name="severity"
                value={form.severity}
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
                Status <span>*</span>
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>

              </select>

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
                ? "Update Bug"
                : "Create Bug"}
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

      {/* BUG LIST */}

      <div className="crud-card bug-list-card">

        <div className="card-heading">

          <div>

            <span className="card-eyebrow">
              ISSUE TRACKER
            </span>

            <h2>
              Bug List
            </h2>

            <p>
              View and manage all reported software bugs.
            </p>

          </div>

          <button
            className="secondary-btn"
            onClick={loadBugs}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>

        {/* SEARCH */}

        <div className="table-toolbar">

          <div className="table-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by title, severity, status, test case..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>

          <span className="result-count">
            Showing {filteredBugs.length} of {bugs.length}
          </span>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="loading">
            Loading bugs...
          </div>
        )}

        {/* TABLE */}

        {!loading &&
          filteredBugs.length > 0 && (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Bug ID</th>
                    <th>Bug</th>
                    <th>Description</th>
                    <th>Reported Date</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Test Case ID</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredBugs.map((bug) => (

                    <tr key={bug.bugId}>

                      {/* BUG ID */}

                      <td>

                        <span className="id-badge">
                          {bug.bugId}
                        </span>

                      </td>

                      {/* BUG TITLE */}

                      <td>

                        <div className="bug-title-cell">

                          <strong>
                            {bug.bugTitle || "-"}
                          </strong>

                        </div>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <div className="table-text">
                          {bug.description || "-"}
                        </div>

                      </td>

                      {/* DATE */}

                      <td>
                        <span className="date-text">
                          {bug.reportedDate || "-"}
                        </span>
                      </td>

                      {/* SEVERITY */}

                      <td>

                        <span
                          className={getSeverityClass(
                            bug.severity
                          )}
                        >
                          {bug.severity || "-"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={getStatusClass(
                            bug.status
                          )}
                        >
                          {bug.status || "-"}
                        </span>

                      </td>

                      {/* TEST CASE */}

                      <td>

                        <span className="project-id-badge">
                          {bug.testcaseId || "-"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(bug)
                            }
                            title="Edit bug"
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                bug.bugId
                              )
                            }
                            title="Delete bug"
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

        {/* NO SEARCH RESULTS */}

        {!loading &&
          bugs.length > 0 &&
          filteredBugs.length === 0 && (

            <div className="empty-message">

              <h3>
                No matching bugs
              </h3>

              <p>
                Try changing your search term.
              </p>

            </div>

          )}

        {/* EMPTY */}

        {!loading &&
          bugs.length === 0 &&
          !error && (

            <div className="empty-message">

              <h3>
                No bugs found
              </h3>

              <p>
                Report your first bug using the form above.
              </p>

            </div>

          )}

      </div>

    </div>
  );
}

export default Bugs;
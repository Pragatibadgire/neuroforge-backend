import { useEffect, useState } from "react";
import {
  getDeployments,
  createDeployment,
  updateDeployment,
  deleteDeployment,
} from "../services/api";

const initialForm = {
  deploymentDate: "",
  environment: "Development",
  projectId: "",
  status: "Pending",
};

function Deployments() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadDeployments();
  }, []);

  const loadDeployments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDeployments();

      setDeployments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading deployments:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load deployments."
      );

      setDeployments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setMessage("");

    // Basic validation
    if (!form.deploymentDate) {
      setError("Please select a deployment date.");
      return;
    }

    if (!form.environment) {
      setError("Please select an environment.");
      return;
    }

    if (!form.projectId) {
      setError("Please enter a project ID.");
      return;
    }

    if (!form.status) {
      setError("Please select a deployment status.");
      return;
    }

    const deploymentData = {
      deploymentDate: form.deploymentDate,
      environment: form.environment,
      projectId: Number(form.projectId),
      status: form.status,
    };

    try {
      setSaving(true);

      if (editingId !== null) {
        await updateDeployment(editingId, deploymentData);

        setMessage("Deployment updated successfully.");
      } else {
        await createDeployment(deploymentData);

        setMessage("Deployment created successfully.");
      }

      setForm(initialForm);
      setEditingId(null);

      await loadDeployments();
    } catch (err) {
      console.error("Deployment save error:", err);

      console.error("Backend response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save deployment. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (deployment) => {
    setError("");
    setMessage("");

    setEditingId(deployment.deploymentId);

    setForm({
      deploymentDate: deployment.deploymentDate || "",
      environment: deployment.environment || "Development",
      projectId:
        deployment.projectId !== null &&
        deployment.projectId !== undefined
          ? String(deployment.projectId)
          : "",
      status: deployment.status || "Pending",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (deploymentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deployment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDeployment(deploymentId);

      setMessage("Deployment deleted successfully.");

      await loadDeployments();
    } catch (err) {
      console.error("Delete deployment error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete deployment."
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setMessage("");
  };

  const filteredDeployments = deployments.filter((deployment) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      String(deployment.deploymentId || "")
        .toLowerCase()
        .includes(search) ||
      String(deployment.environment || "")
        .toLowerCase()
        .includes(search) ||
      String(deployment.projectId || "")
        .toLowerCase()
        .includes(search) ||
      String(deployment.status || "")
        .toLowerCase()
        .includes(search) ||
      String(deployment.deploymentDate || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const totalDeployments = deployments.length;

  const successfulDeployments = deployments.filter(
    (deployment) =>
      deployment.status?.toLowerCase() === "successful"
  ).length;

  const pendingDeployments = deployments.filter(
    (deployment) =>
      deployment.status?.toLowerCase() === "pending"
  ).length;

  const failedDeployments = deployments.filter(
    (deployment) =>
      deployment.status?.toLowerCase() === "failed"
  ).length;

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "successful") {
      return "status-badge status-success";
    }

    if (value === "pending") {
      return "status-badge status-warning";
    }

    if (value === "failed") {
      return "status-badge status-danger";
    }

    if (value === "in progress") {
      return "status-badge status-info";
    }

    return "status-badge";
  };

  const getEnvironmentClass = (environment) => {
    const value = environment?.toLowerCase();

    if (value === "production") {
      return "environment-badge production";
    }

    if (value === "staging") {
      return "environment-badge staging";
    }

    if (value === "testing") {
      return "environment-badge testing";
    }

    return "environment-badge development";
  };

  return (
    <div className="deployments-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">RELEASE MANAGEMENT</div>

          <h1>Deployments</h1>

          <p>
            Manage application deployments across different
            environments.
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="deployment-summary">
        <div className="summary-card">
          <div className="summary-card-content">
            <span className="summary-label">
              Total Deployments
            </span>

            <h3>{totalDeployments}</h3>

            <p>All deployments</p>
          </div>

          <div className="summary-icon total">
            ↥
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-content">
            <span className="summary-label">
              Successful
            </span>

            <h3>{successfulDeployments}</h3>

            <p>Completed successfully</p>
          </div>

          <div className="summary-icon success">
            ✓
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-content">
            <span className="summary-label">
              Pending
            </span>

            <h3>{pendingDeployments}</h3>

            <p>Waiting for deployment</p>
          </div>

          <div className="summary-icon pending">
            ◷
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-content">
            <span className="summary-label">
              Failed
            </span>

            <h3>{failedDeployments}</h3>

            <p>Requires attention</p>
          </div>

          <div className="summary-icon failed">
            !
          </div>
        </div>
      </div>

      {/* CREATE / UPDATE FORM */}
      <div className="deployment-card">
        <div className="card-heading">
          <div>
            <h2>
              {editingId !== null
                ? "Update Deployment"
                : "Create Deployment"}
            </h2>

            <p>
              {editingId !== null
                ? "Update the selected deployment details."
                : "Add a new application deployment."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="deployment-form-grid">
            {/* DATE */}
            <div className="form-group">
              <label htmlFor="deploymentDate">
                Deployment Date
              </label>

              <input
                id="deploymentDate"
                type="date"
                name="deploymentDate"
                value={form.deploymentDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* ENVIRONMENT */}
            <div className="form-group">
              <label htmlFor="environment">
                Environment
              </label>

              <select
                id="environment"
                name="environment"
                value={form.environment}
                onChange={handleChange}
                required
              >
                <option value="Development">
                  Development
                </option>

                <option value="Testing">
                  Testing
                </option>

                <option value="Staging">
                  Staging
                </option>

                <option value="Production">
                  Production
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
                required
              />
            </div>

            {/* STATUS */}
            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Successful">
                  Successful
                </option>

                <option value="Failed">
                  Failed
                </option>

                <option value="In Progress">
                  In Progress
                </option>
              </select>
            </div>
          </div>

          {/* FORM BUTTONS */}
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
                ? "Update Deployment"
                : "Create Deployment"}
            </button>
          </div>
        </form>
      </div>

      {/* DEPLOYMENT LIST */}
      <div className="deployment-card">
        <div className="deployment-list-header">
          <div>
            <h2>Deployment List</h2>

            <p>
              View and manage all application deployments.
            </p>
          </div>

          <div className="deployment-list-actions">
            <input
              type="text"
              className="deployment-search"
              placeholder="Search deployments..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            <button
              type="button"
              className="refresh-btn"
              onClick={loadDeployments}
              disabled={loading}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading deployments...</p>
          </div>
        ) : filteredDeployments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              ↥
            </div>

            <h3>No deployments found</h3>

            <p>
              {searchTerm
                ? "Try a different search term."
                : "Create your first deployment using the form above."}
            </p>
          </div>
        ) : (
          <div className="deployment-table-wrapper">
            <table className="deployment-table">
              <thead>
                <tr>
                  <th>Deployment ID</th>
                  <th>Deployment Date</th>
                  <th>Environment</th>
                  <th>Project ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDeployments.map(
                  (deployment) => (
                    <tr
                      key={deployment.deploymentId}
                    >
                      <td>
                        <span className="id-badge">
                          #
                          {deployment.deploymentId}
                        </span>
                      </td>

                      <td>
                        {deployment.deploymentDate ||
                          "—"}
                      </td>

                      <td>
                        <span
                          className={getEnvironmentClass(
                            deployment.environment
                          )}
                        >
                          {deployment.environment ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <span className="project-id-badge">
                          Project{" "}
                          {deployment.projectId ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            deployment.status
                          )}
                        >
                          {deployment.status ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(
                                deployment
                              )
                            }
                            title="Edit deployment"
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                deployment.deploymentId
                              )
                            }
                            title="Delete deployment"
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

export default Deployments;
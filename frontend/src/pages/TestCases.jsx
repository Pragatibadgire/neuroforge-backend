
import { useEffect, useState } from "react";
import {
  getTestCases,
  createTestCase,
  updateTestCase,
  deleteTestCase,
} from "../services/api";

function TestCases() {
  const emptyForm = {
    testName: "",
    testSteps: "",
    expectedResult: "",
    actualResult: "",
    status: "Not Executed",
    taskId: "",
  };

  const [testCases, setTestCases] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // VALID TASKS FROM YOUR DATABASE
  // =====================================================

  const tasks = [
    {
      id: 1,
      name: "Create Login API",
    },
    {
      id: 2,
      name: "Develop Project Module",
    },
    {
      id: 3,
      name: "Create AI SRS Module",
    },
    {
      id: 4,
      name: "Develop Alert Module",
    },
  ];

  // =====================================================
  // GET ALL TEST CASES
  // =====================================================

  const loadTestCases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTestCases();

      console.log("TEST CASES RESPONSE:", response);

      if (Array.isArray(response)) {
        setTestCases(response);
      } else {
        setTestCases([]);
      }
    } catch (error) {
      console.error("LOAD TEST CASES ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);
      }

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to load test cases."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadTestCases();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!form.testName.trim()) {
      setError("Test name is required.");
      return false;
    }

    if (!form.testSteps.trim()) {
      setError("Test steps are required.");
      return false;
    }

    if (!form.expectedResult.trim()) {
      setError("Expected result is required.");
      return false;
    }

    if (!form.actualResult.trim()) {
      setError("Actual result is required.");
      return false;
    }

    if (!form.taskId) {
      setError("Please select a Task.");
      return false;
    }

    const taskId = Number(form.taskId);

    const validTask = tasks.some((task) => task.id === taskId);

    if (!validTask) {
      setError("Please select a valid Task.");
      return false;
    }

    return true;
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    const data = {
      testName: form.testName.trim(),
      testSteps: form.testSteps.trim(),
      expectedResult: form.expectedResult.trim(),
      actualResult: form.actualResult.trim(),
      status: form.status,
      taskId: Number(form.taskId),
    };

    console.log("=================================");
    console.log("DATA SENT TO BACKEND:", data);
    console.log("TASK ID VALUE:", data.taskId);
    console.log("TASK ID TYPE:", typeof data.taskId);
    console.log("=================================");

    try {
      setSaving(true);

      // =================================================
      // UPDATE
      // =================================================

      if (editingId !== null) {
        console.log("UPDATING TEST CASE:", editingId);

        await updateTestCase(editingId, data);

        setMessage("Test case updated successfully.");
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        console.log("CREATING TEST CASE");

        await createTestCase(data);

        setMessage("Test case created successfully.");
      }

      // Clear form
      setForm(emptyForm);
      setEditingId(null);

      // Reload table
      await loadTestCases();
    } catch (error) {
      console.error("SAVE TEST CASE ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);
      }

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to save test case."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (testCase) => {
    console.log("EDIT TEST CASE:", testCase);

    setEditingId(testCase.testcaseId);

    setForm({
      testName: testCase.testName || "",
      testSteps: testCase.testSteps || "",
      expectedResult: testCase.expectedResult || "",
      actualResult: testCase.actualResult || "",
      status: testCase.status || "Not Executed",

      taskId:
        testCase.taskId !== null &&
        testCase.taskId !== undefined
          ? String(testCase.taskId)
          : "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this test case?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      console.log("DELETING TEST CASE:", id);

      await deleteTestCase(id);

      setMessage("Test case deleted successfully.");

      await loadTestCases();
    } catch (error) {
      console.error("DELETE TEST CASE ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);
      }

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to delete test case."
      );
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredTestCases = testCases.filter((testCase) => {
    const search = searchTerm.toLowerCase();

    return (
      String(testCase.testcaseId || "")
        .toLowerCase()
        .includes(search) ||
      String(testCase.testName || "")
        .toLowerCase()
        .includes(search) ||
      String(testCase.status || "")
        .toLowerCase()
        .includes(search) ||
      String(testCase.taskId || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // =====================================================
  // COUNTS
  // =====================================================

  const passedCount = testCases.filter(
    (test) => test.status === "Passed"
  ).length;

  const failedCount = testCases.filter(
    (test) => test.status === "Failed"
  ).length;

  const notExecutedCount = testCases.filter(
    (test) => test.status === "Not Executed"
  ).length;

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "Passed") {
      return "status-badge status-success";
    }

    if (status === "Failed") {
      return "status-badge status-danger";
    }

    if (status === "Blocked") {
      return "status-badge status-warning";
    }

    return "status-badge status-neutral";
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            QUALITY ASSURANCE
          </span>

          <h1>Test Cases</h1>

          <p>
            Create, update, execute and manage project test cases.
          </p>
        </div>

        <div className="page-header-stat">
          <span>Total Test Cases</span>
          <strong>{testCases.length}</strong>
        </div>
      </div>

      {/* SUCCESS */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* SUMMARY */}

      <div className="summary-grid">

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">
              Total Tests
            </span>

            <div className="summary-icon summary-blue">
              ✓
            </div>
          </div>

          <strong>{testCases.length}</strong>

          <span className="summary-description">
            All test cases
          </span>
        </div>

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">
              Passed
            </span>

            <div className="summary-icon summary-green">
              ✓
            </div>
          </div>

          <strong>{passedCount}</strong>

          <span className="summary-description">
            Successfully passed
          </span>
        </div>

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">
              Failed
            </span>

            <div className="summary-icon summary-red">
              !
            </div>
          </div>

          <strong>{failedCount}</strong>

          <span className="summary-description">
            Tests requiring attention
          </span>
        </div>

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">
              Not Executed
            </span>

            <div className="summary-icon summary-yellow">
              ○
            </div>
          </div>

          <strong>{notExecutedCount}</strong>

          <span className="summary-description">
            Waiting for execution
          </span>
        </div>

      </div>

      {/* FORM */}

      <div className="crud-card">

        <div className="card-heading">
          <div>

            <span className="card-eyebrow">
              TEST MANAGEMENT
            </span>

            <h2>
              {editingId !== null
                ? "Update Test Case"
                : "Add Test Case"}
            </h2>

            <p>
              {editingId !== null
                ? "Modify the selected test case."
                : "Enter the test case details."}
            </p>

          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* TEST NAME */}

            <div className="form-group form-full">

              <label>
                Test Name *
              </label>

              <input
                type="text"
                name="testName"
                value={form.testName}
                onChange={handleChange}
                placeholder="Example: Verify user login"
              />

            </div>

            {/* TEST STEPS */}

            <div className="form-group form-full">

              <label>
                Test Steps *
              </label>

              <textarea
                name="testSteps"
                value={form.testSteps}
                onChange={handleChange}
                placeholder="Example: Enter username, enter password and click Login."
                rows="4"
              />

            </div>

            {/* EXPECTED */}

            <div className="form-group">

              <label>
                Expected Result *
              </label>

              <textarea
                name="expectedResult"
                value={form.expectedResult}
                onChange={handleChange}
                placeholder="Example: User should be logged in."
                rows="4"
              />

            </div>

            {/* ACTUAL */}

            <div className="form-group">

              <label>
                Actual Result *
              </label>

              <textarea
                name="actualResult"
                value={form.actualResult}
                onChange={handleChange}
                placeholder="Enter actual result"
                rows="4"
              />

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status *
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="Not Executed">
                  Not Executed
                </option>

                <option value="Passed">
                  Passed
                </option>

                <option value="Failed">
                  Failed
                </option>

                <option value="Blocked">
                  Blocked
                </option>

              </select>

            </div>

            {/* TASK */}

            <div className="form-group">

              <label>
                Task *
              </label>

              <select
                name="taskId"
                value={form.taskId}
                onChange={handleChange}
              >

                <option value="">
                  -- Select Task --
                </option>

                {tasks.map((task) => (
                  <option
                    key={task.id}
                    value={task.id}
                  >
                    {task.id} - {task.name}
                  </option>
                ))}

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
                ? "Update Test Case"
                : "Create Test Case"}
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

      {/* LIST */}

      <div className="crud-card">

        <div className="card-heading">

          <div>

            <span className="card-eyebrow">
              TEST SUITE
            </span>

            <h2>
              Test Case List
            </h2>

            <p>
              View, update and delete test cases.
            </p>

          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={loadTestCases}
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
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>

          <span className="result-count">
            Showing {filteredTestCases.length} of{" "}
            {testCases.length}
          </span>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="loading">
            Loading test cases...
          </div>
        )}

        {/* TABLE */}

        {!loading && filteredTestCases.length > 0 && (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Test Name</th>
                  <th>Test Steps</th>
                  <th>Expected Result</th>
                  <th>Actual Result</th>
                  <th>Status</th>
                  <th>Task ID</th>
                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredTestCases.map((testCase) => (

                  <tr key={testCase.testcaseId}>

                    <td>

                      <span className="id-badge">
                        {testCase.testcaseId}
                      </span>

                    </td>

                    <td>

                      <strong>
                        {testCase.testName || "-"}
                      </strong>

                    </td>

                    <td>

                      <div className="table-text">
                        {testCase.testSteps || "-"}
                      </div>

                    </td>

                    <td>

                      <div className="table-text">
                        {testCase.expectedResult || "-"}
                      </div>

                    </td>

                    <td>

                      <div className="table-text">
                        {testCase.actualResult || "-"}
                      </div>

                    </td>

                    <td>

                      <span
                        className={getStatusClass(
                          testCase.status
                        )}
                      >
                        {testCase.status || "-"}
                      </span>

                    </td>

                    <td>

                      <span className="project-id-badge">
                        {testCase.taskId || "-"}
                      </span>

                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(testCase)
                          }
                          title="Edit"
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              testCase.testcaseId
                            )
                          }
                          title="Delete"
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

        {/* NO RESULTS */}

        {!loading &&
          testCases.length > 0 &&
          filteredTestCases.length === 0 && (

            <div className="empty-message">

              <h3>
                No matching test cases
              </h3>

              <p>
                Try another search term.
              </p>

            </div>

          )}

        {/* EMPTY */}

        {!loading &&
          testCases.length === 0 &&
          !error && (

            <div className="empty-message">

              <h3>
                No test cases found
              </h3>

              <p>
                Create your first test case using the form above.
              </p>

            </div>

          )}

      </div>

    </div>
  );
}

export default TestCases;


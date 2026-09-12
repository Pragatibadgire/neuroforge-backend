import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";

function Tasks() {
  const emptyForm = {
    taskName: "",
    description: "",
    status: "To Do",
    dueDate: "",
    projectId: "",
  };

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // LOAD TASKS
  // ==========================================

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();

      console.log("Tasks received:", data);

      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET TASKS ERROR:", err);

      const backendError = err.response?.data;

      let errorMessage = "Unable to load tasks.";

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
    loadTasks();
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
  // CREATE / UPDATE TASK
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // TASK NAME VALIDATION

    if (!form.taskName.trim()) {
      setError("Task name is required.");
      return;
    }

    if (form.taskName.trim().length < 3) {
      setError(
        "Task name must contain at least 3 characters."
      );
      return;
    }

    // DESCRIPTION VALIDATION

    if (!form.description.trim()) {
      setError("Task description is required.");
      return;
    }

    // PROJECT ID VALIDATION

    if (!form.projectId) {
      setError("Project ID is required.");
      return;
    }

    if (Number(form.projectId) <= 0) {
      setError("Project ID must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const taskData = {
        taskName: form.taskName.trim(),
        description: form.description.trim(),
        status: form.status,
        dueDate: form.dueDate || null,
        projectId: Number(form.projectId),
      };

      console.log("Task being sent:", taskData);

      // UPDATE

      if (editingId !== null) {
        await updateTask(editingId, taskData);

        setMessage(
          "Task updated successfully."
        );
      }

      // CREATE

      else {
        await createTask(taskData);

        setMessage(
          "Task created successfully."
        );
      }

      // RESET FORM

      setForm(emptyForm);
      setEditingId(null);

      // RELOAD TASKS

      await loadTasks();

    } catch (err) {
      console.error("SAVE TASK ERROR:", err);

      console.error(
        "Backend response:",
        err.response?.data
      );

      const backendError = err.response?.data;

      let errorMessage = "Unable to save task.";

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
  // EDIT TASK
  // ==========================================

  const handleEdit = (task) => {
    setEditingId(task.taskId);

    setForm({
      taskName: task.taskName || "",
      description: task.description || "",
      status: task.status || "To Do",
      dueDate: task.dueDate || "",
      projectId: task.projectId || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteTask(id);

      setMessage(
        "Task deleted successfully."
      );

      await loadTasks();

    } catch (err) {
      console.error(
        "DELETE TASK ERROR:",
        err
      );

      const backendError =
        err.response?.data;

      let errorMessage =
        "Unable to delete task.";

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

  const filteredTasks = tasks.filter(
    (task) => {
      const search =
        searchTerm.toLowerCase();

      return (
        task.taskName
          ?.toLowerCase()
          .includes(search) ||

        task.description
          ?.toLowerCase()
          .includes(search) ||

        task.status
          ?.toLowerCase()
          .includes(search) ||

        String(task.projectId)
          .toLowerCase()
          .includes(search) ||

        String(task.taskId)
          .toLowerCase()
          .includes(search)
      );
    }
  );

  // ==========================================
  // SUMMARY COUNTS
  // ==========================================

  const todoCount = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
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

      case "To Do":
      default:
        return "status-badge status-todo";
    }
  };

  // ==========================================
  // DUE DATE CLASS
  // ==========================================

  const getDueDateClass = (dueDate) => {
    if (!dueDate) {
      return "task-date";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(`${dueDate}T00:00:00`);

    if (date < today) {
      return "task-date overdue";
    }

    return "task-date";
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page tasks-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-header tasks-header">

        <div>

          <span className="page-eyebrow">
            TASK MANAGEMENT
          </span>

          <h1>
            Tasks
          </h1>

          <p>
            Create, assign and track project
            tasks throughout the SDLC.
          </p>

        </div>

        <div className="header-stat-box">

          <span>
            Total Tasks
          </span>

          <strong>
            {tasks.length}
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

      <div className="tasks-summary">

        {/* TOTAL */}

        <div className="task-stat-card">

          <div className="task-stat-icon">
            ✓
          </div>

          <div>

            <span>
              Total Tasks
            </span>

            <strong>
              {tasks.length}
            </strong>

          </div>

        </div>


        {/* TO DO */}

        <div className="task-stat-card">

          <div className="task-stat-icon todo">
            ○
          </div>

          <div>

            <span>
              To Do
            </span>

            <strong>
              {todoCount}
            </strong>

          </div>

        </div>


        {/* IN PROGRESS */}

        <div className="task-stat-card">

          <div className="task-stat-icon progress">
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


        {/* COMPLETED */}

        <div className="task-stat-card">

          <div className="task-stat-icon completed">
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
          TASK FORM
      ===================================== */}

      <div className="crud-card task-form-card">

        <div className="card-heading">

          <div>

            <span className="card-eyebrow">
              TASK DETAILS
            </span>

            <h2>

              {editingId !== null
                ? "Update Task"
                : "Add New Task"}

            </h2>

            <p>

              {editingId !== null
                ? "Modify the selected task."
                : "Create a task and associate it with a project."}

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

            {/* TASK NAME */}

            <div className="form-group form-group-wide">

              <label>
                Task Name *
              </label>

              <input
                type="text"
                name="taskName"
                value={form.taskName}
                onChange={handleChange}
                placeholder="e.g. Develop Login API"
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

                <option value="To Do">
                  To Do
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>


            {/* DUE DATE */}

            <div className="form-group">

              <label>
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />

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
                placeholder="Describe what needs to be completed..."
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
                ? "Update Task"
                : "Create Task"}

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
          TASK LIST
      ===================================== */}

      <div className="crud-card task-list-card">

        <div className="card-heading task-list-heading">

          <div>

            <span className="card-eyebrow">
              PROJECT TASKS
            </span>

            <h2>
              Task List
            </h2>

            <p>
              {filteredTasks.length} of{" "}
              {tasks.length} tasks displayed
            </p>

          </div>


          <div className="task-list-actions">

            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search tasks..."
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
              onClick={loadTasks}
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
            Loading tasks...
          </div>

        )}


        {/* =====================================
            TABLE
        ===================================== */}

        {!loading &&
          filteredTasks.length > 0 && (

            <div className="table-container tasks-table-container">

              <table className="tasks-table">

                <thead>

                  <tr>

                    <th>
                      Task ID
                    </th>

                    <th>
                      Task
                    </th>

                    <th>
                      Project ID
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Due Date
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredTasks.map(
                    (task) => (

                      <tr
                        key={
                          task.taskId
                        }
                      >

                        {/* TASK ID */}

                        <td>

                          <span className="id-badge">
                            {
                              task.taskId
                            }
                          </span>

                        </td>


                        {/* TASK */}

                        <td className="task-title-cell">

                          <strong>
                            {
                              task.taskName ||
                              "-"
                            }
                          </strong>

                          <span>
                            {
                              task.description ||
                              "No description"
                            }
                          </span>

                        </td>


                        {/* PROJECT ID */}

                        <td>

                          <span className="project-id-badge">

                            {
                              task.projectId ||
                              "-"
                            }

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={getStatusClass(
                              task.status
                            )}
                          >

                            {
                              task.status ||
                              "-"
                            }

                          </span>

                        </td>


                        {/* DUE DATE */}

                        <td>

                          <span
                            className={getDueDateClass(
                              task.dueDate
                            )}
                          >

                            {task.dueDate
                              ? task.dueDate
                              : "No due date"}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">

                            <button
                              className="table-action edit"
                              onClick={() =>
                                handleEdit(
                                  task
                                )
                              }
                              title="Edit task"
                            >
                              ✎
                            </button>


                            <button
                              className="table-action delete"
                              onClick={() =>
                                handleDelete(
                                  task.taskId
                                )
                              }
                              title="Delete task"
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
            EMPTY / SEARCH RESULT
        ===================================== */}

        {!loading &&
          filteredTasks.length === 0 && (

            <div className="empty-message">

              {searchTerm ? (
                <>
                  <h3>
                    No matching tasks
                  </h3>

                  <p>
                    Try a different search term.
                  </p>
                </>
              ) : (
                <>
                  <h3>
                    No tasks found
                  </h3>

                  <p>
                    Add your first task using
                    the form above.
                  </p>
                </>
              )}

            </div>

          )}

      </div>

    </div>
  );
}

export default Tasks;
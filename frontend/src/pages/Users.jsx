import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/api";

function Users() {
  const emptyForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Client",
  };

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      console.log("Users received:", data);

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET USERS ERROR:", err);

      const backendError = err.response?.data;

      let errorMessage = "Unable to load users.";

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
    loadUsers();
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
  // CREATE / UPDATE USER
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // NAME VALIDATION

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    // EMAIL VALIDATION

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // PASSWORD VALIDATION

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // PHONE VALIDATION

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    // ROLE VALIDATION

    if (!form.role) {
      setError("Please select a role.");
      return;
    }

    try {
      setSaving(true);

      const userData = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        role: form.role,
      };

      console.log("User being sent:", {
        ...userData,
        password: "********",
      });

      // UPDATE

      if (editingId !== null) {
        await updateUser(editingId, userData);

        setMessage("User updated successfully.");
      }

      // CREATE

      else {
        await createUser(userData);

        setMessage("User created successfully.");
      }

      // RESET FORM

      setForm(emptyForm);
      setEditingId(null);

      // RELOAD USERS

      await loadUsers();
    } catch (err) {
      console.error("SAVE USER ERROR:", err);

      console.error(
        "Backend response:",
        err.response?.data
      );

      const backendError = err.response?.data;

      let errorMessage = "Unable to save user.";

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
  // EDIT USER
  // ==========================================

  const handleEdit = (user) => {
    setEditingId(user.userId);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      phone: user.phone || "",
      role: user.role || "Client",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteUser(id);

      setMessage("User deleted successfully.");

      await loadUsers();
    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      const backendError = err.response?.data;

      let errorMessage = "Unable to delete user.";

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
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  // ==========================================
  // SEARCH USERS
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search) ||
      String(user.userId).includes(search)
    );
  });

  // ==========================================
  // SUMMARY COUNTS
  // ==========================================

  const administratorCount = users.filter(
    (user) => user.role === "Administrator"
  ).length;

  const developerCount = users.filter(
    (user) => user.role === "Developer"
  ).length;

  const qaCount = users.filter(
    (user) => user.role === "QA Engineer"
  ).length;

  // ==========================================
  // ROLE CLASS
  // ==========================================

  const getRoleClass = (role) => {
    switch (role) {
      case "Administrator":
        return "user-role-badge administrator";

      case "Project Manager":
        return "user-role-badge manager";

      case "Business Analyst":
        return "user-role-badge analyst";

      case "Developer":
        return "user-role-badge developer";

      case "QA Engineer":
        return "user-role-badge qa";

      case "DevOps Engineer":
        return "user-role-badge devops";

      case "Client":
      default:
        return "user-role-badge client";
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page users-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-header users-header">

        <div>
          <span className="page-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>
            Users
          </h1>

          <p>
            Manage users and their roles across the
            NeuroForge SDLC platform.
          </p>
        </div>

        <div className="header-stat-box">
          <span>
            Total Users
          </span>

          <strong>
            {users.length}
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

      <div className="users-summary">

        {/* TOTAL */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            U
          </div>

          <div>
            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>
          </div>

        </div>

        {/* ADMINISTRATORS */}

        <div className="user-stat-card">

          <div className="user-stat-icon admin">
            A
          </div>

          <div>
            <span>
              Administrators
            </span>

            <strong>
              {administratorCount}
            </strong>
          </div>

        </div>

        {/* DEVELOPERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon developer">
            D
          </div>

          <div>
            <span>
              Developers
            </span>

            <strong>
              {developerCount}
            </strong>
          </div>

        </div>

        {/* QA ENGINEERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon qa">
            Q
          </div>

          <div>
            <span>
              QA Engineers
            </span>

            <strong>
              {qaCount}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          USER FORM
      ===================================== */}

      <div className="crud-card user-form-card">

        <div className="card-heading">

          <div>

            <span className="card-eyebrow">
              USER DETAILS
            </span>

            <h2>
              {editingId !== null
                ? "Update User"
                : "Add New User"}
            </h2>

            <p>
              {editingId !== null
                ? "Modify the selected user's information."
                : "Create a new user and assign a platform role."}
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

            {/* NAME */}

            <div className="form-group">

              <label>
                Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                maxLength="100"
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                maxLength="150"
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password *
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone *
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit phone number"
                maxLength="10"
              />

            </div>

            {/* ROLE */}

            <div className="form-group">

              <label>
                Role *
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >

                <option value="Administrator">
                  Administrator
                </option>

                <option value="Project Manager">
                  Project Manager
                </option>

                <option value="Business Analyst">
                  Business Analyst
                </option>

                <option value="Developer">
                  Developer
                </option>

                <option value="QA Engineer">
                  QA Engineer
                </option>

                <option value="DevOps Engineer">
                  DevOps Engineer
                </option>

                <option value="Client">
                  Client
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
                ? "Update User"
                : "Create User"}
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
          USER LIST
      ===================================== */}

      <div className="crud-card user-list-card">

        <div className="card-heading user-list-heading">

          <div>

            <span className="card-eyebrow">
              PLATFORM USERS
            </span>

            <h2>
              User List
            </h2>

            <p>
              {filteredUsers.length} of {users.length} users displayed
            </p>

          </div>

          <div className="user-list-actions">

            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>

            <button
              className="secondary-btn"
              onClick={loadUsers}
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
            Loading users...
          </div>
        )}

        {/* =====================================
            TABLE
        ===================================== */}

        {!loading && filteredUsers.length > 0 && (

          <div className="table-container users-table-container">

            <table className="users-table">

              <thead>

                <tr>
                  <th>
                    User ID
                  </th>

                  <th>
                    User
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr key={user.userId}>

                    {/* USER ID */}

                    <td>
                      <span className="id-badge">
                        {user.userId}
                      </span>
                    </td>

                    {/* USER NAME */}

                    <td className="user-name-cell">

                      <div>
                        <strong>
                          {user.name || "-"}
                        </strong>

                        <span>
                          User #{user.userId}
                        </span>
                      </div>

                    </td>

                    {/* ROLE */}

                    <td>

                      <span
                        className={getRoleClass(user.role)}
                      >
                        {user.role || "-"}
                      </span>

                    </td>

                    {/* EMAIL */}

                    <td>

                      <span className="user-email">
                        {user.email || "-"}
                      </span>

                    </td>

                    {/* PHONE */}

                    <td>
                      {user.phone || "-"}
                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">

                        <button
                          className="table-action edit"
                          onClick={() =>
                            handleEdit(user)
                          }
                          title="Edit user"
                        >
                          ✎
                        </button>

                        <button
                          className="table-action delete"
                          onClick={() =>
                            handleDelete(user.userId)
                          }
                          title="Delete user"
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

        {/* =====================================
            EMPTY / SEARCH RESULT
        ===================================== */}

        {!loading &&
          filteredUsers.length === 0 && (

            <div className="empty-message">

              {searchTerm ? (
                <>
                  <h3>
                    No matching users
                  </h3>

                  <p>
                    Try a different search term.
                  </p>
                </>
              ) : (
                <>
                  <h3>
                    No users found
                  </h3>

                  <p>
                    Add your first user using the form above.
                  </p>
                </>
              )}

            </div>

          )}

      </div>

    </div>
  );
}

export default Users;
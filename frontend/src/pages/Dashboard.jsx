import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [projectsRes, requirementsRes, tasksRes, bugsRes] =
        await Promise.all([
          api.get("/api/projects"),
          api.get("/api/requirements"),
          api.get("/api/tasks"),
          api.get("/api/bugs"),
        ]);

      setProjects(projectsRes.data || []);
      setRequirements(requirementsRes.data || []);
      setTasks(tasksRes.data || []);
      setBugs(bugsRes.data || []);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    }
  };

  // -----------------------------
  // Dashboard calculations
  // -----------------------------

  const activeProjects = projects.filter(
    (project) =>
      project.status?.toLowerCase() === "in progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "in progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "to do"
  ).length;

  const openBugs = bugs.filter((bug) => {
    const status = bug.status?.toLowerCase();
    return status !== "resolved" && status !== "closed";
  }).length;

  // -----------------------------
  // Project progress
  // -----------------------------

  const getProjectProgress = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return 100;

      case "in progress":
        return 65;

      case "planning":
        return 25;

      case "on hold":
        return 40;

      default:
        return 15;
    }
  };

  // -----------------------------
  // Status badge class
  // -----------------------------

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "status-completed";

      case "in progress":
        return "status-progress";

      case "planning":
        return "status-planning";

      case "approved":
        return "status-approved";

      case "open":
        return "status-open";

      case "rejected":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  return (
    <div className="dashboard-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here's an overview of your
            software development lifecycle.
          </p>
        </div>

        <NavLink to="/projects" className="dashboard-action-btn">
          <span>+</span>
          New Project
        </NavLink>
      </div>


      {/* =========================================
          WELCOME BANNER
      ========================================= */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-label">
            NEUROFORGE ENTERPRISE SDLC
          </div>

          <h2>
            Build better software,
            <br />
            <span>manage everything in one place.</span>
          </h2>

          <p>
            Track projects, requirements, development tasks,
            testing and deployment from a single platform.
          </p>

          <NavLink to="/projects" className="welcome-btn">
            View Projects
            <span>→</span>
          </NavLink>
        </div>

        <div className="welcome-decoration">
          <div className="decoration-circle circle-one"></div>
          <div className="decoration-circle circle-two"></div>
          <div className="decoration-grid"></div>
        </div>
      </div>


      {/* =========================================
          SUMMARY CARDS
      ========================================= */}
      <div className="dashboard-stats">

        <div className="dashboard-stat-card blue-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon">▣</span>
            <span className="stat-arrow">↗</span>
          </div>

          <p>Total Projects</p>

          <h2>{projects.length}</h2>

          <span className="stat-description">
            {activeProjects} currently in progress
          </span>
        </div>


        <div className="dashboard-stat-card purple-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon">▤</span>
            <span className="stat-arrow">↗</span>
          </div>

          <p>Requirements</p>

          <h2>{requirements.length}</h2>

          <span className="stat-description">
            Project requirements tracked
          </span>
        </div>


        <div className="dashboard-stat-card green-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon">✓</span>
            <span className="stat-arrow">↗</span>
          </div>

          <p>Total Tasks</p>

          <h2>{tasks.length}</h2>

          <span className="stat-description">
            {completedTasks} tasks completed
          </span>
        </div>


        <div className="dashboard-stat-card orange-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon">!</span>
            <span className="stat-arrow">↗</span>
          </div>

          <p>Open Bugs</p>

          <h2>{openBugs}</h2>

          <span className="stat-description">
            Bugs requiring attention
          </span>
        </div>

      </div>


      {/* =========================================
          MAIN DASHBOARD GRID
      ========================================= */}
      <div className="dashboard-main-grid">

        {/* -----------------------------------------
            PROJECT OVERVIEW
        ----------------------------------------- */}
        <div className="dashboard-section project-overview">

          <div className="section-header">
            <div>
              <h2>Project Overview</h2>
              <p>Current progress of your projects</p>
            </div>

            <NavLink to="/projects">
              View All
            </NavLink>
          </div>


          <div className="project-list">

            {projects.length === 0 ? (
              <div className="empty-dashboard">
                No projects available.
              </div>
            ) : (
              projects.slice(0, 5).map((project) => {
                const progress = getProjectProgress(project.status);

                return (
                  <div
                    className="project-progress-item"
                    key={project.projectId}
                  >

                    <div className="project-progress-header">

                      <div className="project-name-wrapper">
                        <div className="project-mini-icon">
                          ▣
                        </div>

                        <div>
                          <h3>{project.projectName}</h3>

                          <span>
                            Manager ID: {project.managerId}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`dashboard-status ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

                    </div>


                    <div className="progress-row">

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        ></div>
                      </div>

                      <span className="progress-number">
                        {progress}%
                      </span>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>


        {/* -----------------------------------------
            TASK STATUS
        ----------------------------------------- */}
        <div className="dashboard-section task-overview">

          <div className="section-header">
            <div>
              <h2>Task Overview</h2>
              <p>Current task distribution</p>
            </div>

            <NavLink to="/tasks">
              View All
            </NavLink>
          </div>


          <div className="task-status-content">

            <div className="task-total-circle">

              <div>
                <strong>{tasks.length}</strong>
                <span>Total Tasks</span>
              </div>

            </div>


            <div className="task-status-list">

              <div className="task-status-row">

                <div className="task-status-label">
                  <span className="status-dot completed-dot"></span>
                  <span>Completed</span>
                </div>

                <strong>{completedTasks}</strong>

              </div>


              <div className="task-status-row">

                <div className="task-status-label">
                  <span className="status-dot progress-dot"></span>
                  <span>In Progress</span>
                </div>

                <strong>{inProgressTasks}</strong>

              </div>


              <div className="task-status-row">

                <div className="task-status-label">
                  <span className="status-dot todo-dot"></span>
                  <span>To Do</span>
                </div>

                <strong>{todoTasks}</strong>

              </div>


              <div className="task-status-row">

                <div className="task-status-label">
                  <span className="status-dot other-dot"></span>
                  <span>Other</span>
                </div>

                <strong>
                  {Math.max(
                    tasks.length -
                      completedTasks -
                      inProgressTasks -
                      todoTasks,
                    0
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          RECENT PROJECTS
      ========================================= */}
      <div className="dashboard-section recent-projects">

        <div className="section-header">
          <div>
            <h2>Recent Projects</h2>
            <p>Latest projects in NeuroForge</p>
          </div>

          <NavLink to="/projects">
            Manage Projects
          </NavLink>
        </div>


        <div className="dashboard-table-wrapper">

          <table className="dashboard-table">

            <thead>
              <tr>
                <th>PROJECT</th>
                <th>STATUS</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>MANAGER</th>
              </tr>
            </thead>

            <tbody>

              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-table">
                    No projects available.
                  </td>
                </tr>
              ) : (
                projects.slice(0, 5).map((project) => (
                  <tr key={project.projectId}>

                    <td>
                      <div className="table-project-name">

                        <div className="table-project-icon">
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
                    </td>


                    <td>
                      <span
                        className={`dashboard-status ${getStatusClass(
                          project.status
                        )}`}
                      >
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
                      Manager #{project.managerId}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =========================================
          QUICK ACCESS
      ========================================= */}
      <div className="quick-access">

        <div className="section-header">
          <div>
            <h2>Quick Access</h2>
            <p>Navigate to your frequently used modules</p>
          </div>
        </div>


        <div className="quick-access-grid">

          <NavLink to="/requirements" className="quick-card">
            <span className="quick-icon purple-icon">▤</span>
            <div>
              <strong>Requirements</strong>
              <span>Manage requirements</span>
            </div>
            <b>→</b>
          </NavLink>


          <NavLink to="/tasks" className="quick-card">
            <span className="quick-icon green-icon">✓</span>
            <div>
              <strong>Tasks</strong>
              <span>Track development tasks</span>
            </div>
            <b>→</b>
          </NavLink>


          <NavLink to="/test-cases" className="quick-card">
            <span className="quick-icon blue-icon">☑</span>
            <div>
              <strong>Test Cases</strong>
              <span>Manage software testing</span>
            </div>
            <b>→</b>
          </NavLink>


          <NavLink to="/bugs" className="quick-card">
            <span className="quick-icon orange-icon">!</span>
            <div>
              <strong>Bugs</strong>
              <span>Track reported bugs</span>
            </div>
            <b>→</b>
          </NavLink>


          <NavLink to="/repository" className="quick-card">
            <span className="quick-icon dark-icon">&lt;/&gt;</span>
            <div>
              <strong>Repository</strong>
              <span>Manage repositories</span>
            </div>
            <b>→</b>
          </NavLink>


          <NavLink to="/deployments" className="quick-card">
            <span className="quick-icon teal-icon">↥</span>
            <div>
              <strong>Deployment</strong>
              <span>Manage deployments</span>
            </div>
            <b>→</b>
          </NavLink>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
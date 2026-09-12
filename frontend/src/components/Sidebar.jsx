import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: "⌂" },
    { name: "Projects", path: "/projects", icon: "▣" },
    { name: "Requirements", path: "/requirements", icon: "▤" },
    { name: "Tasks", path: "/tasks", icon: "✓" },
    { name: "Users", path: "/users", icon: "♟" },
    { name: "Repository", path: "/repository", icon: "◈" },
    { name: "Code Commits", path: "/code-commits", icon: "</>" },
    { name: "Test Cases", path: "/test-cases", icon: "☑" },
    { name: "Bugs", path: "/bugs", icon: "♧" },
    { name: "Deployments", path: "/deployments", icon: "↥" },
  ];

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-brand">
        <div className="brand-logo">N</div>

        <div>
          <h1>NeuroForge</h1>
          <p>Enterprise SDLC Platform</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <p className="nav-section-title">MAIN MENU</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* SIDEBAR FOOTER */}
      <div className="sidebar-bottom">

        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>

          <div className="sidebar-user-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <span className="logout-icon">↪</span>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("neuroforgeUser");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read logged-in user:", error);
  }

  const userName = user?.name || "Admin";
  const userRole = user?.role || "Administrator";

  const handleLogout = () => {
    localStorage.removeItem("neuroforgeUser");
    navigate("/login");
  };

  return (
    <header className="header">

      {/* LEFT SIDE */}
      <div className="header-left">
        <div className="header-page-info">
          <h2>NeuroForge</h2>
          <p>Enterprise Software Development Lifecycle</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="header-right">

        {/* NOTIFICATION */}
        <button className="notification-btn" title="Notifications">
          <span>♢</span>
          <i></i>
        </button>

        {/* USER */}
        <div className="header-user">

          <div className="header-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="header-user-details">
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>

          <span className="header-arrow">⌄</span>
        </div>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          ↪
        </button>

      </div>

    </header>
  );
}

export default Header;
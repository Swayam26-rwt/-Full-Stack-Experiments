import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/rbac";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">RB</div>
          <div>
            <strong>SecurePortal</strong>
            <span>Experiment 3</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          {user.role === "admin" && <NavLink to="/admin">Admin Panel</NavLink>}
          {["admin", "editor"].includes(user.role) && (
            <NavLink to="/editor">Content Editor</NavLink>
          )}
          {hasPermission(user.role, "read") && (
            <NavLink to="/viewer">Read Content</NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini">
            <div className="avatar">{user.name?.[0] ?? "U"}</div>
            <div>
              <strong>{user.name}</strong>
              <span className="role-pill">{user.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">AUTHENTICATION + AUTHORIZATION</span>
            <h1>Role-Based Security Console</h1>
          </div>
          <div className="status"><span /> Session active</div>
        </header>

        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

import { useAuth } from "../context/AuthContext";
import PermissionGate from "../components/PermissionGate";

const roleDescriptions = {
  admin: "Full system access",
  editor: "Create and modify content",
  viewer: "Read-only access"
};

export default function Dashboard() {
  const { user, accessToken } = useAuth();

  const tokenPayload = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - accessToken.split(".")[1].length % 4) % 4)))
    : {};

  return (
    <>
      <div className="hero">
        <div>
          <span className="eyebrow">AUTHENTICATED SESSION</span>
          <h2>Welcome, {user.name}</h2>
          <p>
            Authentication has succeeded. The UI is now being rendered according
            to your role and permissions.
          </p>
        </div>
        <div className="role-card">
          <span>Your role</span>
          <strong>{user.role.toUpperCase()}</strong>
          <small>{roleDescriptions[user.role]}</small>
        </div>
      </div>

      <div className="grid-3">
        <article className="metric-card">
          <span>Identity</span>
          <strong>{user.userId}</strong>
          <small>JWT subject / user ID</small>
        </article>
        <article className="metric-card">
          <span>Token status</span>
          <strong>VALID</strong>
          <small>Access token present</small>
        </article>
        <article className="metric-card">
          <span>Access model</span>
          <strong>RBAC</strong>
          <small>Role-based permissions</small>
        </article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">JWT PAYLOAD</span>
            <h3>Decoded claims</h3>
          </div>
        </div>
        <pre className="code-block">{JSON.stringify(tokenPayload, null, 2)}</pre>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">CONDITIONAL UI</span>
            <h3>Permission-aware controls</h3>
          </div>
        </div>

        <div className="action-row">
          <PermissionGate permission="create">
            <button className="secondary-btn">Create content</button>
          </PermissionGate>

          <PermissionGate permission="edit">
            <button className="secondary-btn">Edit content</button>
          </PermissionGate>

          <PermissionGate permission="delete">
            <button className="danger-btn">Delete content</button>
          </PermissionGate>

          <PermissionGate permission="manage_users">
            <button className="secondary-btn">Manage users</button>
          </PermissionGate>
        </div>
      </section>
    </>
  );
}

import PermissionGate from "../components/PermissionGate";

export default function Viewer() {
  return (
    <div className="page-stack">
      <div className="page-title">
        <span className="eyebrow">ROLE: ALL AUTHENTICATED USERS</span>
        <h2>Read-only Content</h2>
        <p>All authenticated roles can access this resource.</p>
      </div>

      <section className="panel">
        <h3>Security architecture summary</h3>
        <div className="security-list">
          <div><b>01</b><span>Authentication verifies identity.</span></div>
          <div><b>02</b><span>JWT carries signed claims.</span></div>
          <div><b>03</b><span>Protected routes enforce authentication.</span></div>
          <div><b>04</b><span>RBAC controls role-level access.</span></div>
          <div><b>05</b><span>Permission gates conditionally render UI.</span></div>
          <div><b>06</b><span>Axios interceptors centralize token handling.</span></div>
        </div>
      </section>

      <PermissionGate permission="edit">
        <div className="alert success">You have edit permission.</div>
      </PermissionGate>
    </div>
  );
}

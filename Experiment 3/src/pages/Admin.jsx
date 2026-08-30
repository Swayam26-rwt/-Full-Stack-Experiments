import PermissionGate from "../components/PermissionGate";

export default function Admin() {
  return (
    <div className="page-stack">
      <div className="page-title">
        <span className="eyebrow">ROLE: ADMIN</span>
        <h2>Administration Panel</h2>
        <p>Only users with the <b>admin</b> role can enter this route.</p>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h3>User Management</h3>
          <p>Create, update, disable, and review user accounts.</p>
          <PermissionGate permission="manage_users">
            <button className="primary-btn compact">Manage users</button>
          </PermissionGate>
        </section>

        <section className="panel">
          <h3>Destructive Operations</h3>
          <p>Delete actions are exposed only when the role has the permission.</p>
          <PermissionGate permission="delete">
            <button className="danger-btn">Delete resource</button>
          </PermissionGate>
        </section>
      </div>
    </div>
  );
}

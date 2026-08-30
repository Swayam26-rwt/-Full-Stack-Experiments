import PermissionGate from "../components/PermissionGate";

export default function Editor() {
  return (
    <div className="page-stack">
      <div className="page-title">
        <span className="eyebrow">ROLE: ADMIN / EDITOR</span>
        <h2>Content Editor</h2>
        <p>Protected route for users allowed to create or edit content.</p>
      </div>

      <section className="panel">
        <h3>Draft workspace</h3>
        <textarea
          className="editor-box"
          defaultValue="This area represents protected editable content."
        />
        <div className="action-row">
          <PermissionGate permission="create">
            <button className="secondary-btn">Save draft</button>
          </PermissionGate>
          <PermissionGate permission="edit">
            <button className="primary-btn compact">Publish changes</button>
          </PermissionGate>
        </div>
      </section>
    </div>
  );
}

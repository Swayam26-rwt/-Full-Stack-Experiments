import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="center-screen">
      <div className="error-card">
        <span className="eyebrow">403 · FORBIDDEN</span>
        <h1>Access denied</h1>
        <p>Your identity is valid, but your role does not have permission to access this resource.</p>
        <Link className="primary-btn link-btn" to="/dashboard">Return to dashboard</Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="center-screen">
      <div className="error-card">
        <span className="eyebrow">404 · NOT FOUND</span>
        <h1>Route not found</h1>
        <p>The requested resource does not exist.</p>
        <Link className="primary-btn link-btn" to="/">Go home</Link>
      </div>
    </div>
  );
}

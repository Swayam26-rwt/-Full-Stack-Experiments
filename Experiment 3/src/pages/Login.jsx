import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(username, password);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-heading">
          <div className="brand-mark large">RB</div>
          <div>
            <span className="eyebrow">UNIT 1 · EXPERIMENT 3</span>
            <h1>SecurePortal</h1>
            <p>JWT Authentication & Role-Based Access Control</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <div className="alert error">{error}</div>}

          <button className="primary-btn" disabled={busy}>
            {busy ? "Authenticating..." : "Sign in securely"}
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Demo accounts</strong>
          <span>admin / admin123</span>
          <span>editor / editor123</span>
          <span>viewer / viewer123</span>
        </div>
      </div>
    </div>
  );
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canAccessRole } from "../utils/rbac";

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user || !canAccessRole(user.role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

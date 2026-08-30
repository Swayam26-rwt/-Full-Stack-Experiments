import { hasPermission } from "../utils/rbac";
import { useAuth } from "../context/AuthContext";

export default function PermissionGate({ permission, children, fallback = null }) {
  const { user } = useAuth();
  return hasPermission(user?.role, permission) ? children : fallback;
}

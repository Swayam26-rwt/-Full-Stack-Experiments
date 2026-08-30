export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer"
};

export const PERMISSIONS = {
  admin: ["read", "create", "edit", "delete", "manage_users"],
  editor: ["read", "create", "edit"],
  viewer: ["read"]
};

export function hasPermission(role, permission) {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessRole(role, allowedRoles) {
  return allowedRoles.includes(role);
}

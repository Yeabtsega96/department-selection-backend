import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

// Use Better Auth's standard Admin plugin permissions.
export const ac = createAccessControl(defaultStatements);

// Define the permissions for each university role.
export const roles = {
  ADMIN: ac.newRole({
    user: ["create", "set-role"],
  }),
  DEAN: ac.newRole({
    user: ["create"],
  }),

  COORDINATOR: ac.newRole({
    user: [],
  }),

  DEPARTMENT_HEAD: ac.newRole({
    user: [],
  }),

  STUDENT: ac.newRole({
    user: [],
  }),
};

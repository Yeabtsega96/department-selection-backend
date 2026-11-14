import prisma from "../../config/prisma.js";

import { randomBytes } from "node:crypto";
import { auth } from "../../config/auth.js";

export async function getDashboardStats() {
  const [
    totalUsers,
    totalAdmins,
    totalDeans,
    totalCoordinators,
    totalDepartmentHeads,
    totalStudents,
    activeUsers,
    inactiveUsers,
    totalCampuses,
    totalDepartments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "DEAN" } }),
    prisma.user.count({ where: { role: "COORDINATOR" } }),
    prisma.user.count({ where: { role: "DEPARTMENT_HEAD" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.campus.count(),
    prisma.department.count(),
  ]);


  return {
    users: {
        total: totalUsers,
        admins: totalAdmins,
        deans: totalDeans,
        coordinators: totalCoordinators,
        departmentHeads: totalDepartmentHeads,
        students: totalStudents,
        active: activeUsers,
        inactive: inactiveUsers,
    },
    university: {
        campuses: totalCampuses,
        departments: totalDepartments,
    }
  }
}


export async function createUniversityUser({ data, headers }) {
  const { name, email, role } = data;

  // Generate a unique username
  const usernameBase = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20) || "user";

  const username = `${usernameBase}${randomBytes(3).toString("hex")}`;

  // Generate a temporary password
  const temporaryPassword = randomBytes(18).toString("base64url");

  // Create the account through Better Auth
  const result = await auth.api.createUser({
    body: {
      name,
      email,
      password: temporaryPassword,
      role,
      data: {
        username,
        isActive: true,
        mustChangePassword: true,
      }
    },
    headers,
  });

  const user = result.user ?? result; 

  return {
    user,
    temporaryPassword,
  }
}



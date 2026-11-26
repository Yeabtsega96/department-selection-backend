
import prisma from "../../config/prisma.js";
import { randomBytes } from "node:crypto";
import { auth } from "../../config/auth.js";

// ============================================
// ADMIN DASHBOARD
// ============================================

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
    },
  };
}

// ============================================
// CREATE UNIVERSITY USER
// ============================================

export async function createUniversityUser({ data, headers }) {
  const { name, email, role, employeeId } = data;

  const usernameBase =
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20) || "user";

  const username = `${usernameBase}${randomBytes(3).toString("hex")}`;

  const temporaryPassword = randomBytes(18).toString("base64url");

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
      },
    },
    headers,
  });

  const createdUser = result.user ?? result;

  const user = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: createdUser.id },
      data: { role },
    });

    await tx.employeeProfile.create({
      data: {
        userId: createdUser.id,
        employeeId,
      },
    });

    return updatedUser;
  });

  return {
    user,
    temporaryPassword,
  };
}

// ============================================
// GET ALL USERS
// ============================================

export async function getAllUsers({
  page = 1,
  limit = 10,
  search,
  role,
  isActive,
  excludeRole,
}) {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNumber - 1) * pageSize;

  const where = {};
  const roleFilters = [];

  if (role) {
    roleFilters.push({ role });
  }

  if (excludeRole) {
    roleFilters.push({
      role: {
        not: excludeRole.toUpperCase(),
      },
    });
  }

  if (roleFilters.length > 0) {
    where.AND = roleFilters;
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { username: { contains: search } },
    ];
  }

  const [users, totalUsers] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      totalUsers,
      currentPage: page,
      totalPage: Math.ceil(totalUsers / limit),
      pageSize: limit,
    },
  };
}

// ============================================
// GET USER BY ID
// ============================================

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      mustChangePassword: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,

      employeeProfile: {
        select: {
          employeeId: true,
          phone: true,
          jobTitle: true,
          office: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

// ============================================
// UPDATE USER
// ============================================

export async function updateUser(id, data) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    include: {
      employeeProfile: true,
    },
  });

  if (!existingUser) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const staffRoles = ["DEAN", "COORDINATOR", "DEPARTMENT_HEAD"];
  const isStaff = staffRoles.includes(existingUser.role);

  if (
    !isStaff &&
    (data.employeeId !== undefined ||
      data.phone !== undefined ||
      data.jobTitle !== undefined ||
      data.office !== undefined)
  ) {
    const error = new Error(
      "Employee profile fields can only be updated for staff accounts."
    );
    error.statusCode = 400;
    throw error;
  }

  const {
    name,
    email,
    username,
    employeeId,
    phone,
    jobTitle,
    office,
  } = data;

  const userData = {};

  if (name !== undefined) userData.name = name;
  if (email !== undefined) userData.email = email;
  if (username !== undefined) userData.username = username;

  const employeeData = {};

  if (employeeId !== undefined) employeeData.employeeId = employeeId;
  if (phone !== undefined) employeeData.phone = phone;
  if (jobTitle !== undefined) employeeData.jobTitle = jobTitle;
  if (office !== undefined) employeeData.office = office;

  return prisma.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({
        where: { id },
        data: userData,
      });
    }

    if (isStaff) {
      if (existingUser.employeeProfile) {
        if (Object.keys(employeeData).length > 0) {
          await tx.employeeProfile.update({
            where: { userId: id },
            data: employeeData,
          });
        }
      } else {
        if (!employeeId) {
          const error = new Error(
            "Employee ID is required to create the employee profile."
          );
          error.statusCode = 400;
          throw error;
        }

        await tx.employeeProfile.create({
          data: {
            userId: id,
            employeeId,
            phone,
            jobTitle,
            office,
          },
        });
      }
    }

    return tx.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        employeeProfile: {
          select: {
            employeeId: true,
            phone: true,
            jobTitle: true,
            office: true,
          },
        },
        updatedAt: true,
      },
    });
  });
}

// ============================================
// DEACTIVATE USER
// ============================================

export async function deleteUser(id, currentAdminId) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!existingUser) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (id === currentAdminId) {
    const error = new Error(
      "You cannot deactivate your own account."
    );
    error.statusCode = 400;
    throw error;
  }

  if (existingUser.role === "ADMIN") {
    const error = new Error(
      "ADMIN accounts cannot be deactivated through this endpoint."
    );
    error.statusCode = 403;
    throw error;
  }

  if (!existingUser.isActive) {
    const error = new Error("This account is already inactive.");
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id },
      data: {
        isActive: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    await tx.session.deleteMany({
      where: { userId: id },
    });

    return user;
  });
}

// ============================================
// ACTIVATE USER
// ============================================

export async function activateUser(id) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!existingUser) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (existingUser.isActive) {
    const error = new Error("This account is already active.");
    error.statusCode = 400;
    throw error;
  }

  return prisma.user.update({
    where: { id },
    data: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}

// ============================================
// RESET USER PASSWORD
// ============================================

export async function resetUserPassword({
  id,
  currentAdminId,
  headers,
}) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!existingUser) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (id === currentAdminId) {
    const error = new Error(
      "Use the normal password-change process for your own account."
    );
    error.statusCode = 400;
    throw error;
  }

  if (existingUser.role === "ADMIN") {
    const error = new Error(
      "ADMIN passwords cannot be reset through this endpoint."
    );
    error.statusCode = 403;
    throw error;
  }

  const temporaryPassword = randomBytes(18).toString("base64url");

  await auth.api.setUserPassword({
    body: {
      userId: id,
      newPassword: temporaryPassword,
    },
    headers,
  });

  await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: {
        mustChangePassword: true,
      },
    }),

    prisma.session.deleteMany({
      where: { userId: id },
    }),
  ]);

  return {
    user: existingUser,
    temporaryPassword,
  };
}

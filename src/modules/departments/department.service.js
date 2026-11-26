import prisma from "../../config/prisma.js";

// Get all active departments (public)
export async function getDepartments() {
  return prisma.department.findMany({
    where: {
      isActive: true,
    },
    include: {
      campus: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      headAssignments: {
        where: {
          status: "ACTIVE",
        },

        select: {
          id: true,
          assignmentType: true,
          startDate: true,
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

// Get one active department by ID (public)
export async function getDepartmentById(id) {
  const department = await prisma.department.findUnique({
    where: {
      id,
      isActive: true,
    },

    include: {
      campus: true,
      headAssignments: {
        where: {
          status: "ACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  return department;
}

export async function getMyDepartment(userId) {
  // Find the Department Head's active assignment
  const assignment = await prisma.departmentHeadAssignment.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      department: {
        isActive: true,
      },
    },
    include: {
      department: {
        include: {
          campus: true,
          headAssignments: {
            where: {
              status: "ACTIVE",
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!assignment) {
    const error = new Error("You don't have an active department assignment.");
    error.statusCode = 404;
    throw error;
  }

  return assignment.department;
}

export async function createDepartment(data) {
  const { code, campusId } = data;

  // Check whether the campus exists
  const campus = await prisma.campus.findUnique({
    where: { id: campusId },
    select: { id: true },
  });

  if (!campus) {
    const error = new Error("Campus not found.");
    error.statusCode = 404;
    throw error;
  }

  // Check whether the department code already exists
  const existingDepartment = await prisma.department.findUnique({
    where: { code },
    select: { id: true },
  });

  if (existingDepartment) {
    const error = new Error("A department with this code already exists.");
    error.statusCode = 409;
    throw error;
  }

  // create department
  return await prisma.department.create({
    data,
  });
}

export async function updateDepartmentByDean(id, data) {
  const department = await prisma.department.findUnique({
    where: { id },
    select: { id: true, code: true },
  });

  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  // Check campus only when campusId is being changed
  if (data.campus) {
    const campus = await prisma.campus.findUnique({
      where: { id: department.campusId },
      select: { id: true },
    });

    if (!campus) {
      const error = new Error("Campus not found.");
      error.statusCode = 404;
      throw error;
    }
  }

  // Check duplicate code if code is being updated
  if (data.code && data.code !== department.code) {
    const existingCode = await prisma.department.findUnique({
      where: { code: data.code },
      select: { id: true },
    });

    if (existingCode) {
      const error = new Error("A department with this code already exists.");
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.department.update({
    where: { id },
    data,
  });
}

export async function updateDepartmentByHead(userId, data) {
  const assignment = await prisma.departmentHeadAssignment.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      department: {
        isActive: true,
      },
    },
    select: {
      departmentId: true,
    },
  });

  if (!assignment) {
    const error = new Error(
      "You do not have an active PRIMARY department assignment.",
    );
    error.statusCode = 403;
    throw error;
  }

  return prisma.department.update({
    where: { id: assignment.departmentId },
    data,
  });
}

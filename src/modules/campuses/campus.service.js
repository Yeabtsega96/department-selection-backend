import prisma from "../../config/prisma.js";

// ADMIN: Create campus
export async function createCampus(data) {
  const existingCampus = await prisma.campus.findUnique({
    where: { code: data.code },
    select: { id: true },
  });

  if (existingCampus) {
    const error = new Error("A campus with this code already exists.");
    error.statusCode = 409;
    throw error;
  }

  return prisma.campus.create({
    data,
  });
}

// PUBLIC: Get all active campuses
export async function getCampuses() {
  return prisma.campus.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          departments: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

// PUBLIC: Get one active campus
export async function getCampusById(id) {
  const campus = await prisma.campus.findUnique({
    where: {
      id,
      isActive: true,
    },
    include: {
      departments: {
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!campus) {
    const error = new Error("Campus not found.");
    error.statusCode = 404;
    throw error;
  }

  return campus;
}

// ADMIN: Update campus
export async function updateCampus(id, data) {
  const campus = await prisma.campus.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!campus) {
    const error = new Error("Campus not found.");
    error.statusCode = 404;
    throw error;
  }

  return prisma.campus.update({
    where: { id },
    data,
  });
}

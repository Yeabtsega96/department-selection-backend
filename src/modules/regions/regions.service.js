import prisma from "../../config/prisma.js";

export async function createRegion(data) {
  const { code, name, isDevelopingRegion = false } = data;

  const normalizedCode = code.trim().toUpperCase();
  const normalizedName = name.trim();

  const existingRegion = await prisma.region.findUnique({
    where: { code: normalizedCode },
    select: { id: true },
  });

  if (existingRegion) {
    const error = new Error("A region with this code already exists.");
    error.statusCode = 409;
    throw error;
  }

  const region = await prisma.region.create({
    data: {
      code: normalizedCode,
      name: normalizedName,
      isDevelopingRegion,
      isActive: true,
    },
    select: {
      id: true,
      code: true,
      name: true,
      isDevelopingRegion: true,
      isActive: true,
      createdAt: true,
    },
  });

  return region;
}

export async function getRegions({
  search,
  isDevelopingRegion,
  isActive,
} = {}) {
  const searchTerm = search?.trim();

  const where = {
    ...(searchTerm && {
      OR: [
        {
          name: {
            contains: searchTerm,
          },
        },
        {
          code: {
            contains: searchTerm,
          },
        },
      ],
    }),

    ...(isDevelopingRegion !== undefined && {
      isDevelopingRegion,
    }),

    ...(isActive !== undefined && {
      isActive,
    }),
  };

  const [regions, total] = await prisma.$transaction([
    prisma.region.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        code: true,
        name: true,
        isDevelopingRegion: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
    }),

    prisma.region.count({ where }),
  ]);

  return {
    regions: regions.map(({ _count, ...region }) => ({
      ...region,
      studentCount: _count.students,
    })),
    total,
  };
}

export async function getRegionById(id) {
  const region = await prisma.region.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      name: true,
      isDevelopingRegion: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          students: true,
        },
      },
    },
  });

  if (!region) {
    const error = new Error("Region not found.");
    error.statusCode = 404;
    throw error;
  }

  const { _count, ...regionData } = region;

  return {
    ...regionData,
    _count,
  };
}

export async function updateRegion(id, data) {
  const existingRegion = await prisma.region.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingRegion) {
    const error = new Error("Region not found.");
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
  }

  if (data.code !== undefined) {
    updateData.code = data.code.trim();
  }

  if (
    data.isDevelopingRegion !== undefined &&
    typeof data.isDevelopingRegion === "boolean"
  ) {
    updateData.isDevelopingRegion = data.isDevelopingRegion;
  }

  try {
    return await prisma.region.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        code: true,
        name: true,
        isDevelopingRegion: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const duplicateError = new Error(
        "A region with this code already exists.",
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
}

export async function updateRegionStatus(id, isActive) {
  const existingRegion = await prisma.region.findUnique({
    where: { id },
    select: { id: true, isActive: true },
  });

  if (!existingRegion) {
    const error = new Error("Region not found.");
    error.statusCode = 404;
    throw error;
  }

  if (existingRegion.isActive === isActive) {
    const error = new Error(
      `Region is already ${isActive ? "active" : "inactive"}.`,
    );
    error.statusCode = 409;
    throw error;
  }

  const updatedRegion = await prisma.region.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      code: true,
      name: true,
      isDevelopingRegion: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return updatedRegion;
}

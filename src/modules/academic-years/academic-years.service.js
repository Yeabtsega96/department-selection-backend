import prisma from "../../config/prisma.js";

export async function createAcademicYear(data) {
  const { name, startDate, endDate } = data;
  const normalizedName = name.trim();

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  // Check date validity
  if (
    Number.isNaN(parsedStartDate.getTime()) ||
    Number.isNaN(parsedEndDate.getTime())
  ) {
    const error = new Error("Invalid academic year dates.");
    error.statusCode = 400;
    throw error;
  }

  // Check date range
  if (parsedEndDate <= parsedStartDate) {
    const error = new Error("End date must be later than start date.");
    error.statusCode = 400;
    throw error;
  }

  try {
    const academicYear = await prisma.academicYear.create({
      data: {
        name: normalizedName,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status: "UPCOMING",
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
      },
    });

    return academicYear;
  } catch (error) {
    if (error.code === "P2002") {
      const duplicateError = new Error(
        "An academic year with this name already exists.",
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
}

export async function getAcademicYears({ search, status } = {}) {
  const searchTerm = typeof search === "string" ? search.trim() : "";

  const where = {
    ...(searchTerm && {
      name: {
        contains: searchTerm,
      },
    }),

    ...(status && {
      status,
    }),
  };

  const [academicYears, total] = await prisma.$transaction([
    prisma.academicYear.findMany({
      where,
      orderBy: {
        startDate: "desc",
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            studentAcademicRecords: true,
          },
        },
      },
    }),

    prisma.academicYear.count({ where }),
  ]);

  return {
    data: academicYears.map(({ _count, ...academicYear }) => ({
      ...academicYear,
      studentRecordCount: _count.studentAcademicRecords,
    })),
    total,
  };
}

export async function getAcademicYearById(id) {
  const academicYear = await prisma.academicYear.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          studentAcademicRecords: true,
        },
      },
    },
  });

  if (!academicYear) {
    const error = new Error("Academic year not found.");
    error.statusCode = 404;
    throw error;
  }

  const { _count, ...academicYearData } = academicYear;

  return {
    ...academicYearData,
    studentRecordCount: _count.studentAcademicRecords,
  };
}

export async function updateAcademicYear(id, data) {
  const existingAcademicYear = await prisma.academicYear.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });

  if (!existingAcademicYear) {
    const error = new Error("Academic year not found.");
    error.statusCode = 404;
    throw error;
  }

  // Prevent editing completed academic years
  if (existingAcademicYear.status === "COMPLETED") {
    const error = new Error("Completed academic years cannot be updated.");
    error.statusCode = 409;
    throw error;
  }

  const updateData = {
    ...(data.name !== undefined && {
      name: data.name.trim(),
    }),

    ...(data.startDate !== undefined && {
      startDate: new Date(data.startDate),
    }),

    ...(data.endDate !== undefined && {
      endDate: new Date(data.endDate),
    }),
  };

  const finalStartDate = updateData.startDate ?? existingAcademicYear.startDate;
  const finalEndDate = updateData.endDate ?? existingAcademicYear.endDate;

  if (finalEndDate <= finalStartDate) {
    const error = new Error("End date must be later than start date.");
    error.statusCode = 400;
    throw error;
  }

  try {
    return await prisma.academicYear.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const duplicateError = new Error(
        "An academic year with this name already exists.",
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
}

export async function updateAcademicYearStatus(id, status) {
  const academicYear = await prisma.academicYear.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      status: true,
    },
  });

  if (!academicYear) {
    const error = new Error("Academic year not found.");
    error.statusCode = 404;
    throw error;
  }

  // ACTIVE status is managed separately
  if (status === "ACTIVE") {
    const error = new Error(
      "Use the set current academic year operation to activate an academic year."
    );
    error.statusCode = 400;
    throw error;
  }

  // Prevent changing the status to its existing value
  if (academicYear.status === status) {
    const error = new Error(`Academic year is already ${status}.`);
    error.statusCode = 409;
    throw error;
  }

  // Prevent changing an active year directly
  if (academicYear.status === "ACTIVE") {
    const error = new Error(
      "The current academic year cannot be changed through this operation. Set another academic year as current first.",
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.academicYear.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function setCurrentAcademicYear(id) {
  try {
    return await prisma.$transaction(async (tx) => {
      const academicYear = await tx.academicYear.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });
      if (!academicYear) {
        const error = new Error("Academic year not found.");
        error.statusCode = 404;
        throw error;
      }

      // Check whether it is already current
      if (academicYear.status === "ACTIVE") {
        const error = new Error(
          "This academic year is already the current academic year.",
        );
        error.statusCode = 409;
        throw error;
      }

      // Completed years cannot become current
      if (academicYear.status === "COMPLETED") {
        const error = new Error(
          "A completed academic year cannot be set as current.",
        );
        error.statusCode = 409;
        throw error;
      }

      // Complete the previous active academic year(s)
      await tx.academicYear.updateMany({
        where: { status: "ACTIVE" },
        data: { status: "COMPLETED" },
      });

      // Activate the requested academic year
      const updatedAcademicYear = await tx.academicYear.update({
        where: { id },
        data: { status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          status: true,
          updatedAt: true,
        },
      });

      return updatedAcademicYear;
    });
  } catch (error) {
    if (error.code === "P2034") {
      const conflictError = new Error(
        "Another academic year update is in progress. Please try again.",
      );
      conflictError.statusCode = 409;
      throw conflictError;
    }

    throw error;
  }
}

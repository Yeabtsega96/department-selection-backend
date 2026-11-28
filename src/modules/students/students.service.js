import { randomBytes } from "node:crypto";

import { auth } from "../../config/auth.js";
import prisma from "../../config/prisma.js";
import {
  encryptCredential,
  decryptCredential,
} from "../../utils/credential-encryption.js";

export async function createStudent({ data }) {
  const { name, universityStudentId, gender, regionId, enrollmentYear } = data;

  // 1. Normalize input
  const normalizedName = name.trim();
  const normalizedStudentId = universityStudentId.trim();

  // 2. Check whether username already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: normalizedStudentId },
    select: { id: true },
  });

  if (existingUser) {
    const error = new Error("An account with this username already exists.");
    error.statusCode = 409;
    throw error;
  }

  // 3. Check whether student ID already exists
  const existingStudent = await prisma.studentProfile.findUnique({
    where: { universityStudentId: normalizedStudentId },
    select: { id: true },
  });

  if (existingStudent) {
    const error = new Error(
      "This university student ID is already registered.",
    );
    error.statusCode = 409;
    throw error;
  }

  // 4. Check region
  const region = await prisma.region.findFirst({
    where: {
      id: regionId,
      isActive: true,
    },
    select: { id: true },
  });

  if (!region) {
    const error = new Error("Region not found or inactive.");
    error.statusCode = 400;
    throw error;
  }

  // 5. Generate university email
  const emailBase =
    normalizedName
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9.]/g, "")
      .replace(/\.+/g, ".")
      .slice(0, 12)
      .replace(/^\.|\.$/g, "") || "student";

  const email = `${emailBase}.${randomBytes(8).toString("hex")}@wollega.university.com`;

  // 6. Generate temporary password
  const temporaryPassword = randomBytes(8).toString("base64url");
       
  // 7. Encrypt temporary password
  const encryptedPassword = encryptCredential(temporaryPassword);

  // Keep the ID outside try so cleanup can access it
  let createdUserId = null;

  try {
    // 8. Create Better Auth account
    const result = await auth.api.createUser({
      body: {
        name: normalizedName,
        email,
        password: temporaryPassword,
        role: "STUDENT",
        data: {
          username: normalizedStudentId,
          isActive: true,
          mustChangePassword: true,
        },
      }
    });

    const createdUser = result.user ?? result;

    if (!createdUser?.id) {
      throw new Error("Student account creation failed.");
    }

    createdUserId = createdUser.id;

    // 9. Create profile and credential atomically
    const student = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: createdUserId },
        data: {
          role: "STUDENT",
          isActive: true,
          mustChangePassword: true,
        },
      });

      const studentProfile = await tx.studentProfile.create({
        data: {
          userId: createdUserId,
          universityStudentId: normalizedStudentId,
          gender,
          regionId,
          enrollmentYear,
          emailType: "UNIVERSITY",
        },
        include: {
          region: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      });

      await tx.studentCredential.create({
        data: {
          userId: createdUserId,
          encryptedPassword,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return studentProfile;
    });

    // 10. Return safe student information
    return {
      user: {
        id: createdUserId,
        name: normalizedName,
        email,
        username: normalizedStudentId,
        role: "STUDENT",
        isActive: true,
        mustChangePassword: true,
      },
      student,
      credentialStatus: "PENDING",
    };
  } catch (error) {
    // 11. Cleanup if Better Auth account was created
    if (createdUserId) {
      try {
        await prisma.user.delete({
          where: { id: createdUserId },
        });
      } catch (cleanupError) {
        console.error(
          "Student account cleanup failed:",
          createdUserId,
          cleanupError,
        );
      }
    }

    throw error;
  }
}

export async function getStudents({
  page = 1,
  limit = 10,
  search,
  gender,
  regionId,
  studentStatus,
}) {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNumber - 1) * pageSize;

  const where = {};

  if (regionId) {
    where.regionId = regionId;
  }

  if (gender) {
    where.gender = gender;
  }

  if (studentStatus !== undefined) {
    where.studentStatus = studentStatus;
  }

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    where.OR = [
      {
        universityStudentId: {
          contains: trimmedSearch,
        },
      },
      {
        user: {
          name: {
            contains: trimmedSearch,
          },
        },
      },
    ];
  }

  const [students, total] = await prisma.$transaction([
    prisma.studentProfile.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        universityStudentId: true,
        gender: true,
        enrollmentYear: true,
        studentStatus: true,
        emailType: true,
        createdAt: true,
        updatedAt: true,

        region: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            isActive: true,
            mustChangePassword: true,
          },
        },
      },
    }),

    prisma.studentProfile.count({ where }),
  ]);

  return {
    students,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: pageNumber * pageSize < total,
      hasPreviousPage: pageNumber > 1,
    },
  };
}

export async function getStudentTemporaryPassword(userId) {
  const credential = await prisma.studentCredential.findUnique({
    where: { userId },
    select: {
      expiresAt: true,
      encryptedPassword: true,
    },
  });

  if (!credential || credential.expiresAt <= new Date()) {
    const error = new Error("No valid pending temporary credential found.");
    error.statusCode = 404;
    throw error;
  }

  const temporaryPassword = decryptCredential(credential.encryptedPassword);

  return {
    temporaryPassword,
    credentialStatus: "PENDING",
    expiresAt: credential.expiresAt,
  };
}

export async function getStudentById(universityStudentId) {
  const student = await prisma.studentProfile.findUnique({
    where: { universityStudentId },
    select: {
      id: true,
      universityStudentId: true,
      gender: true,
      enrollmentYear: true,
      studentStatus: true,
      emailType: true,

      region: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          mustChangePassword: true,
          isActive: true,
        },
      },
    },
  });

  if (!student) {
    const error = new Error("Student not found.");
    error.statusCode = 404;
    throw error;
  }

  return student;
}

export async function updateStudent(universityStudentId, data) {
  const {
    name,
    email,
    universityStudentId: newStudentId,
    gender,
    regionId,
    enrollmentYear,
    emailType,
  } = data;

  // 1. Find existing student
  const existingStudent = await prisma.studentProfile.findUnique({
    where: { universityStudentId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!existingStudent) {
    const error = new Error("Student not found.");
    error.statusCode = 404;
    throw error;
  }

  // 2. Build User update payload safely
  const userData = {};

  if (name !== undefined && name.trim()) {
    userData.name = name.trim();
  }

  if (email !== undefined && email.trim()) {
    const normalizedEmail = email.trim().toLowerCase();

    const emailInUse = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: { id: existingStudent.userId },
      },
      select: { id: true },
    });

    if (emailInUse) {
      const error = new Error(
        "This email is already in use by another account.",
      );
      error.statusCode = 409;
      throw error;
    }

    userData.email = normalizedEmail;
  }

  // Handle student ID change if allowed
  const trimmedNewStudentId = newStudentId?.trim();
  if (trimmedNewStudentId && trimmedNewStudentId !== universityStudentId) {
    const idInUse = await prisma.studentProfile.findUnique({
      where: { universityStudentId: trimmedNewStudentId },
      select: { id: true },
    });

    if (idInUse) {
      const error = new Error(
        "This university student ID is already registered.",
      );
      error.statusCode = 409;
      throw error;
    }

    userData.username = trimmedNewStudentId;
  }

  // 3. Validate region ONLY if regionId was provided
  if (regionId !== undefined) {
    const region = await prisma.region.findFirst({
      where: { id: regionId, isActive: true },
      select: { id: true },
    });

    if (!region) {
      const error = new Error("Region not found or inactive.");
      error.statusCode = 400;
      throw error;
    }
  }

  // 4. Update User and StudentProfile atomically
  const updatedStudent = await prisma.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({
        where: { id: existingStudent.userId },
        data: userData,
      });
    }

    return tx.studentProfile.update({
      where: { universityStudentId },
      data: {
        ...(trimmedNewStudentId && {
          universityStudentId: trimmedNewStudentId,
        }),
        ...(gender !== undefined && { gender }),
        ...(regionId !== undefined && { regionId }),
        ...(enrollmentYear !== undefined && { enrollmentYear }),
        ...(emailType !== undefined && { emailType }),
      },
      select: {
        id: true,
        universityStudentId: true,
        gender: true,
        enrollmentYear: true,
        studentStatus: true,
        emailType: true,
        region: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            isActive: true,
          },
        },
      },
    });
  });

  return updatedStudent;
}

export async function updateStudentStatus(universityStudentId, isActive) {
  const student = await prisma.studentProfile.findUnique({
    where: { universityStudentId },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          isActive: true,
        },
      },
    },
  });

  if (!student) {
    const error = new Error("Student not found.");
    error.statusCode = 404;
    throw error;
  }

  if (student.user.isActive === isActive) {
    const error = new Error(
      `Student account is already ${isActive ? "active" : "inactive"}.`,
    );
    error.statusCode = 409;
    throw error;
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: student.userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    // Revoke existing sessions when deactivating an account.
    if (!isActive) {
      await tx.session.deleteMany({
        where: { userId: student.userId },
      });
    }

    return user;
  });

  return {
    universityStudentId,
    user: updatedUser,
  }
}

import { randomBytes } from "node:crypto";

import { auth } from "../../config/auth.js";
import prisma from "../../config/prisma.js";

export async function createDepartmentHead({ data, headers }) {
  const { name, email } = data;

  // Generate a unique username
  const usernameBase =
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20) || "user";

  const username = `${usernameBase}${randomBytes(3).toString("hex")}`;

  // Generate a temporary password
  const temporaryPassword = randomBytes(18).toString("base64url");

  // Create the account using Better Auth
  const result = await auth.api.createUser({
    body: {
      name,
      email,
      password: temporaryPassword,
      data: {
        username,
        isActive: true,
        mustChangePassword: true,
      },
    },

    headers,
  });

  const createdUser = result.user ?? result;

  // Assign the permitted role from the backend
  const updatedUser = await prisma.user.update({
    where: { id: createdUser.id },
    data: {
      role: "DEPARTMENT_HEAD",
    },
  });

  
  return {
    user: updatedUser,
    temporaryPassword,
  };
}


export async function createDepartmentHeadAssignment({ data, assignedBy}) {
   const {
    departmentId,
    userId,
    assignmentType,
    startDate,
   } = data;

   return prisma.$transaction(async (tx) => {
    // Check whether the department exists
    const department = await tx.department.findUnique({
      where: { id: departmentId },
    });

    if(!department) {
      const error = new Error("Department not found.");
      error.status = 404;
      throw error;
    }

    // 2. Check whether the user exists and is eligible
    const departmentHead = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
      }
    });

    if(!departmentHead) {
      const error = new Error("User not found.");
      error.status = 404;
      throw error;
    }

    if(departmentHead.role !== "DEPARTMENT_HEAD") {
      const error = new Error("The selected user is not a Department Head.");
      error.status = 400;
      throw error;
    }

    if(!departmentHead.isActive) {
      const error = new Error("This user's account is inactive.");
      error.status = 400;
      throw error;
    }

    // 3. Only one active PRIMARY assignment per department
    if(assignmentType === "PRIMARY") {
      const existingPrimary = await tx.departmentHeadAssignment.findFirst({
        where: {
          departmentId,
          assignmentType: "PRIMARY",
          status: "ACTIVE",
        }
      });

      if(existingPrimary) {
        const error = new Error("This department already has an active PRIMARY Department Head.");
        error.status = 400;
        throw error;
      }

    }

    // create an assignment 
      return tx.departmentHeadAssignment.create({
        data: {
          departmentId,
          userId,
          assignedBy,
          assignmentType,
          startDate,
        }
      });

   });
}
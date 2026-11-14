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

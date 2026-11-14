
import "dotenv/config";

import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import prisma from "../config/prisma.js";
import { auth } from "../config/auth.js";

const rl = createInterface({
  input: stdin,
  output: stdout,
});

async function createAdmin() {
  try {
    // Check whether an administrator already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      throw new Error("An administrator already exists.");
    }

    const name = (await rl.question("Admin name: ")).trim();
    const email = (await rl.question("Admin email: ")).trim().toLowerCase();

    if (!name || !email) {
      throw new Error("Name and email are required.");
    }

    // Check whether the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("This email is already registered.");
    }

    // Generate a temporary random password
    const password = randomBytes(18).toString("base64url");

    // Create the account through Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!result?.user?.id) {
      throw new Error("Better Auth did not return the created user.");
    }

    // Promote the newly created user to ADMIN
    const admin = await prisma.user.update({
      where: { id: result.user.id },
      data: {
        role: "ADMIN",
        isActive: true,
        mustChangePassword: true,
      },
    });

    console.log("\nAdministrator created successfully!");
    console.log("--------------------------------");
    console.log("Name:", admin.name);
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Active:", admin.isActive);
    console.log("Must change password:", admin.mustChangePassword);
    console.log("\nTemporary password:", password);
    console.log("--------------------------------");
    console.log("Save this password securely.");
  } catch (error) {
    console.error("\nAdmin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();

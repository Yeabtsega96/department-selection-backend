import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username, admin as adminPlugin } from "better-auth/plugins";

import { ac, roles } from "./auth-permissions.js";

import prisma from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    disableSignUp: true,
  },

  plugins: [
    username({
      minUsernameLength: 5,
      maxUsernameLength: 30,
      immutableUsername: true,
      displayUsername: false,
    }),

    adminPlugin({
      ac,
      roles,
      defaultRole: "STUDENT",
    }),
  ],

  user: {
    additionalFields: {
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },

      mustChangePassword: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
    },
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});

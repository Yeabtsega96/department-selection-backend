
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";

import prisma from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

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
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "STUDENT",
        input: false,
      },

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

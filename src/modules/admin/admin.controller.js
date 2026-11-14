import { getDashboardStats } from "./admin.service.js";

import { fromNodeHeaders } from "better-auth/node";
import { validateCreateUser } from "./admin.validation.js";
import { createUniversityUser } from "./admin.service.js";

export async function getDashboard(req, res, next) {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      message: "Admin dashboard statistics retrieved successfully.",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUniversityUserController(req, res, next) {
  // 1. Validate request body
  const validation = validateCreateUser(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    // 2. Create user through the service
    const { user, temporaryPassword } = await createUniversityUser({
      data: validation.data,
      headers: fromNodeHeaders(req.headers),
    });

    // 3. Return the created account

    return res.status(201).json({
      success: true,
      message: "User account created successfully.",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
        },
        temporaryPassword,
      }
    })
  } catch (error) {
    next(error);
  }
}

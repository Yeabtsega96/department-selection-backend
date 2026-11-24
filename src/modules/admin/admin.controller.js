import { fromNodeHeaders } from "better-auth/node";

import { validateCreateUser, validateUpdateUser } from "./admin.validation.js";

import {
  getDashboardStats,
  createUniversityUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  resetUserPassword,
} from "./admin.service.js";

export async function getDashboard(req, res, next) {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard statistics retrieved successfully.",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUniversityUserController(req, res, next) {
  const validation = validateCreateUser(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    const { user, temporaryPassword } = await createUniversityUser({
      data: validation.data,
      headers: fromNodeHeaders(req.headers),
    });

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
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsersController(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );

    const { search, role, excludeRole } = req.query;

    let isActive;

    if (req.query.isActive !== undefined) {
      if (!["true", "false"].includes(req.query.isActive)) {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false.",
        });
      }

      isActive = req.query.isActive === "true";
    }

    const result = await getAllUsers({
      page,
      limit,
      search: search?.trim(),
      role,
      isActive,
      excludeRole,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserByIdController(req, res, next) {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(req, res, next) {
  const validation = validateUpdateUser(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    const user = await updateUser(req.params.id, validation.data);

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(req, res, next) {
  try {
    const user = await deleteUser(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function activateUserController(req, res, next) {
  try {
    const user = await activateUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User activated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetUserPasswordController(req, res, next) {
  try {
    const result = await resetUserPassword({
      id: req.params.id,
      currentAdminId: req.user.id,
      headers: fromNodeHeaders(req.headers),
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

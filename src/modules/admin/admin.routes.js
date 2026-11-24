
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import {
  getDashboard,
  createUniversityUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  activateUserController,
  resetUserPasswordController,
} from "./admin.controller.js";

const router = Router();

// All admin routes require ADMIN authentication
router.use(requireAuth, requireRole("ADMIN"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: University administration management
 */

router.get("/dashboard", getDashboard);

router.get("/users", getAllUsersController);

router.get("/users/:id", getUserByIdController);

router.post("/users", createUniversityUserController);

router.patch("/users/:id", updateUserController);

router.delete("/users/:id", deleteUserController);

router.patch("/users/:id/activate", activateUserController);

router.post(
  "/users/:id/reset-password",
  resetUserPasswordController
);

export default router;

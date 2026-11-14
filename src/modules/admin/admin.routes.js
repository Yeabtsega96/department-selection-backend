
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import {
  getDashboard,
  createUniversityUserController,
} from "./admin.controller.js";

const router = Router();

// All admin routes require ADMIN authentication
router.use(requireAuth, requireRole("ADMIN"));

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     description: Retrieve dashboard information for the authenticated administrator.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 */
router.get("/dashboard", getDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a university user
 *     description: Create a Dean or Coordinator account.
 *     tags:
 *       - Admin
 *     responses:
 *       201:
 *         description: University user created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 */
router.post("/users", createUniversityUserController);

export default router;


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

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve system-wide statistics and summary information for the admin dashboard. Only administrators can access this endpoint.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard", getDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all university users
 *     description: Retrieve all users registered in the university system, including their roles and account information.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/users", getAllUsersController);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve detailed information about a specific university user using their unique user ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID
 *         example: "cm123456789"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/users/:id", getUserByIdController);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create university user
 *     description: Create a new university user account and assign the appropriate role and account information.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New university user information
 *             example:
 *               name: "Abebe Kebede"
 *               email: "abebe@example.com"
 *               username: "abebe.kebede"
 *               role: "COORDINATOR"
 *     responses:
 *       201:
 *         description: University user created successfully
 *       400:
 *         description: Invalid or incomplete user information
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/users", createUniversityUserController);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Update university user
 *     description: Update an existing university user's profile, role, or account information.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID
 *         example: "cm123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: User fields to update
 *             example:
 *               name: "Abebe Kebede"
 *               username: "abebe.kebede"
 *               role: "DEAN"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid update information
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/users/:id", updateUserController);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete university user
 *     description: Delete an existing university user account using their unique user ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID
 *         example: "cm123456789"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/users/:id", deleteUserController);

/**
 * @swagger
 * /api/admin/users/{id}/activate:
 *   patch:
 *     summary: Activate university user
 *     description: Activate an existing university user's account, allowing them to access the system according to their assigned role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID
 *         example: "cm123456789"
 *     responses:
 *       200:
 *         description: User activated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/users/:id/activate", activateUserController);

/**
 * @swagger
 * /api/admin/users/{id}/reset-password:
 *   post:
 *     summary: Reset university user password
 *     description: Reset the password of an existing university user. The system may generate a temporary password and require the user to change it on their next login.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID
 *         example: "cm123456789"
 *     responses:
 *       200:
 *         description: User password reset successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/users/:id/reset-password", resetUserPasswordController);

export default router;

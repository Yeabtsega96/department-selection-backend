
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
 *     summary: Get admin dashboard
 *     description: Retrieve dashboard information for the authenticated administrator.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required or account inactive.
 */
router.get("/dashboard", getDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all university users
 *     description: Retrieve all users registered in the university system.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 */
router.get("/users", getAllUsersController);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve detailed information about a specific user.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 *       404:
 *         description: User not found.
 */
router.get("/users/:id", getUserByIdController);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a university user
 *     description: Create a Dean or Coordinator account. The corresponding EmployeeProfile is created automatically.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *               - employeeId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abebe Kebede
 *               email:
 *                 type: string
 *                 format: email
 *                 example: abebe@university.edu
 *               role:
 *                 type: string
 *                 enum: [DEAN, COORDINATOR]
 *                 example: DEAN
 *               employeeId:
 *                 type: string
 *                 example: EMP001
 *     responses:
 *       201:
 *         description: University user created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 *       409:
 *         description: User already exists.
 */
router.post("/users", createUniversityUserController);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Update university user
 *     description: Update the information of an existing university user.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update. See the update controller validation for supported fields.
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abebe Kebede
 *               email:
 *                 type: string
 *                 format: email
 *                 example: abebe@university.edu
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 *       404:
 *         description: User not found.
 */
router.patch("/users/:id", updateUserController);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete university user
 *     description: Delete a university user by their ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 *       404:
 *         description: User not found.
 */
router.delete("/users/:id", deleteUserController);

/**
 * @swagger
 * /api/admin/users/{id}/activate:
 *   patch:
 *     summary: Activate university user
 *     description: Activate an inactive university user account.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin permission required.
 *       404:
 *         description: User not found.
 */
router.patch("/users/:id/activate", activateUserController);



router.post(
  "/users/:id/reset-password",
  resetUserPasswordController
);
export default router;

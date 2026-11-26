
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
 *     description: Retrieve total users, users grouped by role, active and inactive users, campuses, and departments.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin dashboard statistics retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 2500
 *                         admins:
 *                           type: integer
 *                           example: 2
 *                         deans:
 *                           type: integer
 *                           example: 5
 *                         coordinators:
 *                           type: integer
 *                           example: 10
 *                         departmentHeads:
 *                           type: integer
 *                           example: 30
 *                         students:
 *                           type: integer
 *                           example: 2453
 *                         active:
 *                           type: integer
 *                           example: 2400
 *                         inactive:
 *                           type: integer
 *                           example: 100
 *                     university:
 *                       type: object
 *                       properties:
 *                         campuses:
 *                           type: integer
 *                           example: 3
 *                         departments:
 *                           type: integer
 *                           example: 25
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
 *     description: Retrieve users with pagination and optional search, role, active-status, and excluded-role filters.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (defaults to 1).
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page (maximum 100).
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name, email, or username.
 *         example: Abebe
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, DEAN, COORDINATOR, DEPARTMENT_HEAD, STUDENT]
 *         description: Filter users by their role.
 *         example: COORDINATOR
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter users by account status.
 *         example: "true"
 *       - in: query
 *         name: excludeRole
 *         schema:
 *           type: string
 *           enum: [ADMIN, DEAN, COORDINATOR, DEPARTMENT_HEAD, STUDENT]
 *         description: Exclude users with the specified role.
 *         example: STUDENT
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               users:
 *                 - id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@example.com"
 *                   username: "abebekebede123"
 *                   role: "COORDINATOR"
 *                   isActive: true
 *                   mustChangePassword: false
 *                   createdAt: "2026-11-20T10:00:00.000Z"
 *                   updatedAt: "2026-11-20T10:00:00.000Z"
 *               pagination:
 *                 totalUsers: 25
 *                 currentPage: 1
 *                 totalPage: 3
 *                 pageSize: 10
 *       400:
 *         description: Invalid isActive query parameter
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: isActive must be true or false.
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
 *     description: Retrieve a university user's account and employee profile information.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID.
 *         example: "user_123"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "user_123"
 *                 name: "Abebe Kebede"
 *                 username: "abebekebede123"
 *                 email: "abebe@example.com"
 *                 role: "COORDINATOR"
 *                 isActive: true
 *                 mustChangePassword: false
 *                 emailVerified: true
 *                 createdAt: "2026-11-20T10:00:00.000Z"
 *                 updatedAt: "2026-11-20T10:00:00.000Z"
 *                 employeeProfile:
 *                   employeeId: "EMP-001"
 *                   phone: "0912345678"
 *                   jobTitle: "Department Coordinator"
 *                   office: "Administration Building"
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
 *     description: Create a staff account with an automatically generated username and temporary password. An employee profile is also created.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "Abebe Kebede"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "abebe@example.com"
 *               role:
 *                 type: string
 *                 enum: [DEAN, COORDINATOR]
 *                 example: "COORDINATOR"
 *               employeeId:
 *                 type: string
 *                 example: "EMP-001"
 *           example:
 *             name: "Abebe Kebede"
 *             email: "abebe@example.com"
 *             role: "COORDINATOR"
 *             employeeId: "EMP-001"
 *     responses:
 *       201:
 *         description: User account created successfully. Username and temporary password are generated by the server.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User account created successfully.
 *               data:
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@example.com"
 *                   username: "abebekebede123"
 *                   role: "COORDINATOR"
 *                   isActive: true
 *                 temporaryPassword: "generated-temporary-password"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Validation failed.
 *               errors:
 *                 - Employee ID is required.
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
 *     description: Update user account information and, for staff accounts, employee profile information. Only supplied fields are updated.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID.
 *         example: "user_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Abebe Kebede"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "abebe.new@example.com"
 *               username:
 *                 type: string
 *                 example: "abebekebede"
 *               employeeId:
 *                 type: string
 *                 example: "EMP-001"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               jobTitle:
 *                 type: string
 *                 example: "Senior Coordinator"
 *               office:
 *                 type: string
 *                 example: "Administration Building"
 *           example:
 *             name: "Abebe Kebede"
 *             phone: "0912345678"
 *             jobTitle: "Senior Coordinator"
 *             office: "Administration Building"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User updated successfully.
 *               data:
 *                 id: "user_123"
 *                 name: "Abebe Kebede"
 *                 email: "abebe@example.com"
 *                 username: "abebekebede123"
 *                 role: "COORDINATOR"
 *                 isActive: true
 *                 mustChangePassword: false
 *                 employeeProfile:
 *                   employeeId: "EMP-001"
 *                   phone: "0912345678"
 *                   jobTitle: "Senior Coordinator"
 *                   office: "Administration Building"
 *                 updatedAt: "2026-11-26T10:00:00.000Z"
 *       400:
 *         description: Validation failed or employee profile update is invalid
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Validation failed.
 *               errors:
 *                 - At least one valid field is required.
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
 *     summary: Deactivate university user
 *     description: Deactivate a user account and delete all existing sessions. This endpoint does not permanently delete the user.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID.
 *         example: "user_123"
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User deactivated successfully.
 *               data:
 *                 id: "user_123"
 *                 name: "Abebe Kebede"
 *                 email: "abebe@example.com"
 *                 role: "COORDINATOR"
 *                 isActive: false
 *       400:
 *         description: Account is already inactive or administrator attempted to deactivate their own account
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin accounts cannot be deactivated
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
 *     description: Activate an inactive university user account.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID.
 *         example: "user_123"
 *     responses:
 *       200:
 *         description: User activated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User activated successfully.
 *               data:
 *                 id: "user_123"
 *                 name: "Abebe Kebede"
 *                 email: "abebe@example.com"
 *                 role: "COORDINATOR"
 *                 isActive: true
 *       400:
 *         description: User account is already active
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
 *     description: Generate a new temporary password, update the user's password, require a password change at next login, and invalidate existing sessions. Admin accounts and the current administrator cannot be reset through this endpoint.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID.
 *         example: "user_123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Password reset successfully.
 *               data:
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@example.com"
 *                   role: "COORDINATOR"
 *                 temporaryPassword: "new-generated-temporary-password"
 *       400:
 *         description: Cannot reset your own password through this endpoint
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: ADMIN passwords cannot be reset through this endpoint
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/users/:id/reset-password", resetUserPasswordController);

export default router;

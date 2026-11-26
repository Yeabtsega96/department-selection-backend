
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import {
  createDepartmentHeadController,
  createDepartmentHeadAssignmentController,
} from "./dean.controller.js";

const router = Router();

// All Dean routes require DEAN authentication
router.use(requireAuth, requireRole("DEAN"));


router.post("/department-heads", createDepartmentHeadController);


router.post(
  "/department-head-assignments",
  createDepartmentHeadAssignmentController
);


/**
 * @swagger
 * tags:
 *   name: Dean
 *   description: Dean account and department-head assignment management
 */

/**
 * @swagger
 * /api/dean/department-heads:
 *   post:
 *     summary: Create a Department Head account
 *     description: |
 *       Allows an authenticated Dean to create a Department Head account.
 *       The system automatically generates a username and temporary password.
 *       The account is assigned the DEPARTMENT_HEAD role and an employee profile.
 *     tags: [Dean]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abebe Kebede
 *               email:
 *                 type: string
 *                 format: email
 *                 example: abebe@university.edu.et
 *               employeeId:
 *                 type: string
 *                 example: EMP-2026-001
 *             required:
 *               - name
 *               - email
 *               - employeeId
 *           example:
 *             name: Abebe Kebede
 *             email: abebe@university.edu.et
 *             employeeId: EMP-2026-001
 *     responses:
 *       201:
 *         description: Department Head account created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Department Head account created successfully.
 *               data:
 *                 user:
 *                   id: "user_123"
 *                   name: Abebe Kebede
 *                   email: abebe@university.edu.et
 *                   username: abebekebedea1b2c3
 *                   role: DEPARTMENT_HEAD
 *                   isActive: true
 *                 temporaryPassword: "generated-temporary-password"
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Validation failed.
 *               errors:
 *                 - "name is required."
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only users with the DEAN role can create Department Heads.
 *       409:
 *         description: Email or username already exists.
 */

/**
 * @swagger
 * /api/dean/department-head-assignments:
 *   post:
 *     summary: Assign a Department Head to a department
 *     description: |
 *       Allows an authenticated Dean to assign an existing Department Head
 *       to a department. The selected user must have the DEPARTMENT_HEAD role
 *       and an active account. A department can have only one active PRIMARY assignment.
 *     tags: [Dean]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentId:
 *                 type: string
 *                 example: "dept_123"
 *               userId:
 *                 type: string
 *                 example: "user_123"
 *               assignmentType:
 *                 type: string
 *                 enum: [PRIMARY, ACTING]
 *                 example: PRIMARY
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-26T00:00:00.000Z"
 *             required:
 *               - departmentId
 *               - userId
 *               - assignmentType
 *               - startDate
 *           example:
 *             departmentId: "dept_123"
 *             userId: "user_123"
 *             assignmentType: PRIMARY
 *             startDate: "2026-11-26T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Department Head assigned successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Department Head assigned successfully.
 *               data:
 *                 id: "assignment_123"
 *                 departmentId: "dept_123"
 *                 userId: "user_123"
 *                 assignedBy: "dean_123"
 *                 assignmentType: PRIMARY
 *                 startDate: "2026-11-26T00:00:00.000Z"
 *                 status: ACTIVE
 *       400:
 *         description: Invalid assignment, inactive account, incorrect role, or existing active PRIMARY assignment.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: This department already has an active PRIMARY Department Head.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only users with the DEAN role can create assignments.
 *       404:
 *         description: Department or Department Head user not found.
 */


export default router;

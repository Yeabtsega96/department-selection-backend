import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import {
  createDepartmentHeadController,
  createDepartmentHeadAssignmentController,
  getDepartmentHeadsController,
  getDepartmentHeadByIdController,
} from "./dean.controller.js";
const router = Router();

// All Dean routes require DEAN authentication
router.use(requireAuth, requireRole("DEAN"));

/**
 * @swagger
 * tags:
 *   name: Dean
 *   description: Dean account and department-head assignment management
 */

/**
 * @swagger
 * /api/dean/department-heads:
 *   get:
 *     summary: Get all Department Heads
 *     description: Retrieve Department Heads with pagination and optional filtering.
 *     tags: [Dean]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of Department Heads per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search Department Heads by name, email, or employee ID, if supported by the service.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, ENDED]
 *         description: Filter assignments by assignment status, if supported by the service.
 *     responses:
 *       200:
 *         description: Department Heads retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "assignment_123"
 *                   departmentId: "dept_123"
 *                   userId: "user_123"
 *                   assignmentType: PRIMARY
 *                   status: ACTIVE
 *                   startDate: "2026-11-26T00:00:00.000Z"
 *                   department:
 *                     id: "dept_123"
 *                     name: "Computer Science"
 *                   user:
 *                     id: "user_123"
 *                     name: "Abebe Kebede"
 *                     email: "abebe@university.edu.et"
 *                     username: "abebekebede"
 *                     isActive: true
 *               pagination:
 *                 total: 1
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEAN role required.
 *       500:
 *         description: Internal server error.
 */
router.get("/department-heads", getDepartmentHeadsController);

/**
 * @swagger
 * /api/dean/department-heads/{id}:
 *   get:
 *     summary: Get Department Head by ID
 *     description: Retrieve detailed information about a Department Head assignment using its assignment ID.
 *     tags: [Dean]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department Head assignment ID.
 *         example: "assignment_123"
 *     responses:
 *       200:
 *         description: Department Head retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "assignment_123"
 *                 departmentId: "dept_123"
 *                 userId: "user_123"
 *                 assignmentType: PRIMARY
 *                 status: ACTIVE
 *                 startDate: "2026-11-26T00:00:00.000Z"
 *                 department:
 *                   id: "dept_123"
 *                   name: "Computer Science"
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@university.edu.et"
 *                   username: "abebekebede"
 *                   isActive: true
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEAN role required.
 *       404:
 *         description: Department Head assignment not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/department-heads/:id", getDepartmentHeadByIdController);

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
 *             required:
 *               - name
 *               - email
 *               - employeeId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Abebe Kebede"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "abebe@university.edu.et"
 *               employeeId:
 *                 type: string
 *                 example: "EMP-2026-001"
 *           example:
 *             name: "Abebe Kebede"
 *             email: "abebe@university.edu.et"
 *             employeeId: "EMP-2026-001"
 *     responses:
 *       201:
 *         description: Department Head account created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Department Head account created successfully."
 *               data:
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@university.edu.et"
 *                   username: "abebekebedea1b2c3"
 *                   role: DEPARTMENT_HEAD
 *                   isActive: true
 *                 temporaryPassword: "generated-temporary-password"
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEAN role required.
 *       409:
 *         description: Email or username already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/department-heads", createDepartmentHeadController);

/**
 * @swagger
 * /api/dean/department-head-assignments:
 *   post:
 *     summary: Assign a Department Head to a department
 *     description: |
 *       Allows a Dean to assign an existing Department Head to a department.
 *       The selected user must have the DEPARTMENT_HEAD role and an active account.
 *       A department can have only one active PRIMARY assignment.
 *     tags: [Dean]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departmentId
 *               - userId
 *               - assignmentType
 *               - startDate
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
 *               message: "Department Head assigned successfully."
 *               data:
 *                 id: "assignment_123"
 *                 departmentId: "dept_123"
 *                 userId: "user_123"
 *                 assignedBy: "dean_123"
 *                 assignmentType: PRIMARY
 *                 startDate: "2026-11-26T00:00:00.000Z"
 *                 status: ACTIVE
 *       400:
 *         description: Invalid assignment or another active PRIMARY assignment exists.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEAN role required.
 *       404:
 *         description: Department or Department Head user not found.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/department-head-assignments",
  createDepartmentHeadAssignmentController
);

export default router;
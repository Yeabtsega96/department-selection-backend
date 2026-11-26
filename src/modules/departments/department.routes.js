
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import {
    createDepartmentController,
    getDepartmentByIdController,
    getDepartmentsController,
    updateDepartmentByDeanController,
    updateDepartmentByHeadController,
    getMyDepartmentController,
} from "./department.controller.js";

const router = Router();




router.get("/", getDepartmentsController);


router.post(
    "/",
    requireAuth,
    requireRole("DEAN"),
    createDepartmentController
);



router.get(
    "/my",
    requireAuth,
    requireRole("DEPARTMENT_HEAD"),
    getMyDepartmentController
);



router.patch(
    "/my",
    requireAuth,
    requireRole("DEPARTMENT_HEAD"),
    updateDepartmentByHeadController
);


router.get("/:id", getDepartmentByIdController);


router.patch(
    "/:id",
    requireAuth,
    requireRole("DEAN"),
    updateDepartmentByDeanController
);




/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all active departments
 *     description: Public endpoint. Retrieves all active departments, including campus information and active department-head assignments.
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Departments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - id: "dept_123"
 *                   name: "Computer Science"
 *                   code: "CS"
 *                   campusId: "campus_123"
 *                   isActive: true
 *                   campus:
 *                     id: "campus_123"
 *                     code: "MAIN"
 *                     name: "Main Campus"
 *                   headAssignments:
 *                     - id: "assignment_123"
 *                       assignmentType: "PRIMARY"
 *                       startDate: "2026-01-01T00:00:00.000Z"
 *                       user:
 *                         id: "user_123"
 *                         name: "Example Department Head"
 */

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get an active department by ID
 *     description: Public endpoint. Retrieves one active department, including its campus and active department-head assignments.
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID.
 *     responses:
 *       200:
 *         description: Department retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "dept_123"
 *                 name: "Computer Science"
 *                 code: "CS"
 *                 campusId: "campus_123"
 *                 isActive: true
 *                 campus:
 *                   id: "campus_123"
 *                   name: "Main Campus"
 *                 headAssignments:
 *                   - id: "assignment_123"
 *                     assignmentType: "PRIMARY"
 *                     user:
 *                       id: "user_123"
 *                       name: "Example Department Head"
 *       404:
 *         description: Department not found or inactive.
 */

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a department
 *     description: Allows an authenticated DEAN to create a department.
 *     tags: [Departments]
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
 *                 example: Computer Science
 *               code:
 *                 type: string
 *                 example: CS
 *               campusId:
 *                 type: string
 *                 example: campus_123
 *           example:
 *             name: Computer Science
 *             code: CS
 *             campusId: campus_123
 *     responses:
 *       201:
 *         description: Department created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Department created successfully.
 *               data:
 *                 id: "dept_123"
 *                 name: Computer Science
 *                 code: CS
 *                 campusId: campus_123
 *                 isActive: true
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEAN role required.
 *       404:
 *         description: Campus not found.
 *       409:
 *         description: Department code already exists.
 */

/**
 * @swagger
 * /api/departments/my:
 *   get:
 *     summary: Get my assigned department
 *     description: Retrieves the active department assigned to the authenticated Department Head.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned department retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "dept_123"
 *                 name: Computer Science
 *                 code: CS
 *                 campus:
 *                   id: "campus_123"
 *                   name: Main Campus
 *                 headAssignments:
 *                   - id: "assignment_123"
 *                     assignmentType: PRIMARY
 *                     user:
 *                       id: "user_123"
 *                       name: Example Department Head
 *                       username: example.head
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEPARTMENT_HEAD role required.
 *       404:
 *         description: No active department assignment found.
 */

/**
 * @swagger
 * /api/departments/my:
 *   patch:
 *     summary: Update my assigned department
 *     description: Allows a Department Head to update information for their active assigned department.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields accepted by the Department Head update validator.
 *           example:
 *             name: Computer Science
 *     responses:
 *       200:
 *         description: Department information updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Department information updated successfully.
 *               data:
 *                 id: "dept_123"
 *                 name: Computer Science
 *                 code: CS
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEPARTMENT_HEAD role required or no active assignment.
 */

/**
 * @swagger
 * /api/departments/{id}:
 *   patch:
 *     summary: Update a department
 *     description: Allows an authenticated DEAN to update a department by ID.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields accepted by the Dean update validator.
 *           example:
 *             name: Computer Science
 *             code: CS
 *             campusId: campus_123
 *     responses:
 *       200:
 *         description: Department updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Department updated successfully.
 *               data:
 *                 id: "dept_123"
 *                 name: Computer Science
 *                 code: CS
 *                 campusId: campus_123
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: DEAN role required.
 *       404:
 *         description: Department or campus not found.
 *       409:
 *         description: Department code already exists.
 */

export default router;

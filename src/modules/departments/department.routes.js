
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
 *     summary: Get all departments
 *     description: Retrieve a list of all departments.
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Departments retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getDepartmentsController);

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a department
 *     description: Allows an authenticated Dean to create a new department.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Department created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Deans can create departments.
 */
router.post(
    "/",
    requireAuth,
    requireRole("DEAN"),
    createDepartmentController
);

/**
 * @swagger
 * /api/departments/my:
 *   get:
 *     summary: Get my department
 *     description: Retrieve the department assigned to the authenticated Department Head.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned department retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Department Heads can access this resource.
 *       404:
 *         description: No department assigned to this user.
 */
router.get(
    "/my",
    requireAuth,
    requireRole("DEPARTMENT_HEAD"),
    getMyDepartmentController
);

/**
 * @swagger
 * /api/departments/my:
 *   patch:
 *     summary: Update my department
 *     description: Allows a Department Head to update their assigned department.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Department Heads can update their assigned department.
 *       404:
 *         description: Assigned department not found.
 */
router.patch(
    "/my",
    requireAuth,
    requireRole("DEPARTMENT_HEAD"),
    updateDepartmentByHeadController
);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     description: Retrieve a specific department using its ID.
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
 *       404:
 *         description: Department not found.
 */
router.get("/:id", getDepartmentByIdController);

/**
 * @swagger
 * /api/departments/{id}:
 *   patch:
 *     summary: Update a department
 *     description: Allows an authenticated Dean to update any department.
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
 *     responses:
 *       200:
 *         description: Department updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Deans can update departments.
 *       404:
 *         description: Department not found.
 */
router.patch(
    "/:id",
    requireAuth,
    requireRole("DEAN"),
    updateDepartmentByDeanController
);

export default router;

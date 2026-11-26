
import { Router } from "express";

import {
    createStudentController,
    getStudentsController,
    getStudentTemporaryPasswordController,
    getStudentByIdController,
    updateStudentController,
    updateStudentStatusController,
} from "./students.controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student account and profile management
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of students with their profile information. Accessible by administrators, coordinators, and deans.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    requireRole("ADMIN", "COORDINATOR", "DEAN"),
    getStudentsController
);

/**
 * @swagger
 * /api/students/{universityStudentId}:
 *   get:
 *     summary: Get student by university student ID
 *     description: Retrieve detailed information about a specific student using their university student ID.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityStudentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique university student ID
 *         example: "WU/1234/16"
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:universityStudentId",
    requireRole("ADMIN", "COORDINATOR", "DEAN"),
    getStudentByIdController
);

/**
 * @swagger
 * /api/students/{id}/temporary-password:
 *   get:
 *     summary: Get student temporary password
 *     description: Retrieve the temporary password associated with a student account. Only coordinators can access this endpoint.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student user ID
 *         example: "cm123456789"
 *     responses:
 *       200:
 *         description: Temporary password retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only coordinators are allowed
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:id/temporary-password",
    requireRole("COORDINATOR"),
    getStudentTemporaryPasswordController
);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create student account
 *     description: Create a new student account and collect the student's initial profile information. Only coordinators can create student accounts.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Student registration information
 *             example:
 *               name: "Abebe Kebede"
 *               universityStudentId: "WU/1234/16"
 *               gender: "MALE"
 *               enrollmentYear: 2024
 *               email: "abebe@example.com"
 *     responses:
 *       201:
 *         description: Student account created successfully
 *       400:
 *         description: Invalid or incomplete student information
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only coordinators are allowed
 *       409:
 *         description: Student already exists
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    requireRole("COORDINATOR"),
    createStudentController
);

/**
 * @swagger
 * /api/students/{universityStudentId}:
 *   patch:
 *     summary: Update student information
 *     description: Update an existing student's profile information using their university student ID. Only coordinators can update student information.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityStudentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique university student ID
 *         example: "WU/1234/16"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update. Only provided fields will be changed.
 *             example:
 *               name: "Abebe Kebede"
 *               gender: "MALE"
 *               enrollmentYear: 2024
 *     responses:
 *       200:
 *         description: Student information updated successfully
 *       400:
 *         description: Invalid update data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only coordinators are allowed
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */

router.patch(
    "/:universityStudentId",
    requireRole("COORDINATOR"),
    updateStudentController
);

/**
 * @swagger
 * /api/students/{universityStudentId}/status:
 *   patch:
 *     summary: Update student status
 *     description: Update the academic or account status of a specific student using their university student ID. Only coordinators can perform this operation.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityStudentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique university student ID
 *         example: "WU/1234/16"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status to assign to the student
 *                 example: ACTIVE
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Student status updated successfully
 *       400:
 *         description: Invalid or unsupported student status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only coordinators are allowed
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:universityStudentId/status",
    requireRole("COORDINATOR"),
    updateStudentStatusController
);


export default router;

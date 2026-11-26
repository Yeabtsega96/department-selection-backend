
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



router.get(
    "/",
    requireRole("ADMIN", "COORDINATOR", "DEAN"),
    getStudentsController
);


router.get(
    "/:universityStudentId",
    requireRole("ADMIN", "COORDINATOR", "DEAN"),
    getStudentByIdController
);


router.get(
    "/:id/temporary-password",
    requireRole("COORDINATOR"),
    getStudentTemporaryPasswordController
);


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


router.patch(
    "/:universityStudentId/status",
    requireRole("COORDINATOR"),
    updateStudentStatusController
);


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
 *     description: |
 *       Retrieve students with pagination and optional filtering.
 *       Accessible by ADMIN, COORDINATOR, and DEAN.
 *     tags: [Students]
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
 *         description: Number of students per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by student name or university student ID.
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Filter by gender.
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: string
 *         description: Filter by region ID.
 *       - in: query
 *         name: studentStatus
 *         schema:
 *           type: boolean
 *         description: Filter by student status. Send true or false.
 *     responses:
 *       200:
 *         description: Students retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               students:
 *                 - id: "profile_123"
 *                   universityStudentId: "WU/1234/16"
 *                   gender: "MALE"
 *                   enrollmentYear: 2024
 *                   studentStatus: true
 *                   emailType: "UNIVERSITY"
 *                   createdAt: "2026-11-26T08:00:00.000Z"
 *                   updatedAt: "2026-11-26T08:00:00.000Z"
 *                   region:
 *                     id: "region_123"
 *                     code: "OR"
 *                     name: "Oromia"
 *                   user:
 *                     id: "user_123"
 *                     name: "Abebe Kebede"
 *                     email: "abebe@example.com"
 *                     username: "WU/1234/16"
 *                     role: "STUDENT"
 *                     isActive: true
 *                     mustChangePassword: true
 *               pagination:
 *                 total: 250
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 25
 *                 hasNextPage: true
 *                 hasPreviousPage: false
 *       400:
 *         description: Invalid studentStatus query parameter.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Insufficient permissions.
  */

/**
 * @swagger
 * /api/students/{universityStudentId}:
 *   get:
 *     summary: Get student by university student ID
 *     description: Retrieve detailed student information using the university student ID.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityStudentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "WU/1234/16"
 *     responses:
 *       200:
 *         description: Student retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Student retrieved successfully.
 *               data:
 *                 id: "profile_123"
 *                 universityStudentId: "WU/1234/16"
 *                 gender: "MALE"
 *                 enrollmentYear: 2024
 *                 studentStatus: true
 *                 emailType: "UNIVERSITY"
 *                 region:
 *                   id: "region_123"
 *                   name: "Oromia"
 *                   code: "OR"
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@example.com"
 *                   username: "WU/1234/16"
 *                   mustChangePassword: true
 *                   isActive: true
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Insufficient permissions.
 *       404:
 *         description: Student not found.
*/

/**
 * @swagger
 * /api/students/{id}/temporary-password:
 *   get:
 *     summary: Get student temporary password
 *     description: Retrieve a valid pending temporary credential using the student's user ID. Only COORDINATOR can access this endpoint.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student user ID, not the university student ID.
 *     responses:
 *       200:
 *         description: Temporary student password retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Temporary student password retrieved successfully.
 *               data:
 *                 temporaryPassword: "example-temporary-password"
 *                 credentialStatus: "PENDING"
 *                 expiresAt: "2026-12-26T08:00:00.000Z"
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: COORDINATOR role required.
 *       404:
 *         description: No valid pending temporary credential found.
  */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create student account
 *     description: |
 *       Allows a COORDINATOR to create a student account.
 *       The backend generates the university email and temporary password.
 *       The university student ID is also used as the username.
 *     tags: [Students]
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
 *                 example: "Abebe Kebede"
 *               universityStudentId:
 *                 type: string
 *                 example: "WU/1234/16"
 *               gender:
 *                 type: string
 *                 example: "MALE"
 *               regionId:
 *                 type: string
 *                 example: "region_123"
 *               enrollmentYear:
 *                 type: integer
 *                 example: 2024
 *             required:
 *               - name
 *               - universityStudentId
 *               - gender
 *               - regionId
 *               - enrollmentYear
 *           example:
 *             name: "Abebe Kebede"
 *             universityStudentId: "WU/1234/16"
 *             gender: "MALE"
 *             regionId: "region_123"
 *             enrollmentYear: 2024
 *     responses:
 *       201:
 *         description: Student account created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Student account created successfully.
 *               data:
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe.1234abcd@wollega.university.com"
 *                   username: "WU/1234/16"
 *                   role: "STUDENT"
 *                   isActive: true
 *                   mustChangePassword: true
 *                 student:
 *                   id: "profile_123"
 *                   universityStudentId: "WU/1234/16"
 *                   gender: "MALE"
 *                   enrollmentYear: 2024
 *                   region:
 *                     id: "region_123"
 *                     code: "OR"
 *                     name: "Oromia"
 *                 credentialStatus: "PENDING"
 *       400:
 *         description: Validation failed or region not found/inactive.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: COORDINATOR role required.
 *       409:
 *         description: Username or university student ID already exists.
 */

/**
 * @swagger
 * /api/students/{universityStudentId}:
 *   patch:
 *     summary: Update student information
 *     description: Update student account and profile information. Only COORDINATOR can perform this operation.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityStudentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "WU/1234/16"
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
 *                 example: "abebe@example.com"
 *               universityStudentId:
 *                 type: string
 *                 example: "WU/5678/16"
 *               gender:
 *                 type: string
 *                 example: "MALE"
 *               regionId:
 *                 type: string
 *                 example: "region_123"
 *               enrollmentYear:
 *                 type: integer
 *                 example: 2024
 *               emailType:
 *                 type: string
 *                 example: "PERSONAL"
 *           example:
 *             name: "Abebe Kebede"
 *             email: "abebe@example.com"
 *             gender: "MALE"
 *             regionId: "region_123"
 *             enrollmentYear: 2024
 *             emailType: "PERSONAL"
 *     responses:
 *       200:
 *         description: Student account updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Student account updated successfully.
 *               data:
 *                 id: "profile_123"
 *                 universityStudentId: "WU/1234/16"
 *                 gender: "MALE"
 *                 enrollmentYear: 2024
 *                 studentStatus: true
 *                 emailType: "PERSONAL"
 *                 region:
 *                   id: "region_123"
 *                   name: "Oromia"
 *                   code: "OR"
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@example.com"
 *                   username: "WU/1234/16"
 *                   isActive: true
 *       400:
 *         description: Validation failed or region not found/inactive.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: COORDINATOR role required.
 *       404:
 *         description: Student not found.
 *       409:
 *         description: Email or university student ID already exists.
 */

/**
 * @swagger
 * /api/students/{universityStudentId}/status:
 *   patch:
 *     summary: Activate or deactivate student account
 *     description: |
 *       Updates the student's account active status.
 *       Deactivating an account also revokes its existing sessions.
 *       Only COORDINATOR can perform this operation.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: universityStudentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "WU/1234/16"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *           example:
 *             isActive: false
 *     responses:
 *       200:
 *         description: Student account status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Student account deactivated successfully.
 *               data:
 *                 universityStudentId: "WU/1234/16"
 *                 user:
 *                   id: "user_123"
 *                   name: "Abebe Kebede"
 *                   email: "abebe@example.com"
 *                   username: "WU/1234/16"
 *                   role: "STUDENT"
 *                   isActive: false
 *       400:
 *         description: isActive must be a boolean.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: COORDINATOR role required.
 *       404:
 *         description: Student not found.
 *       409:
 *         description: Student account already has the requested status.
 */


export default router;

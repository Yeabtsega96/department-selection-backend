import { Router } from "express";

import {
  createAcademicYearController,
  getAcademicYearsController,
  getAcademicYearByIdController,
  updateAcademicYearController,
  updateAcademicYearStatusController,
  setCurrentAcademicYearController,
} from "./academic-years.controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = Router();

router.use(requireAuth);


/**
 * @swagger
 * tags:
 *   name: Academic Years
 *   description: Academic year management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicYear:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "academic_year_123"
 *         name:
 *           type: string
 *           example: "2026/2027"
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-09-01T00:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2027-06-30T00:00:00.000Z"
 *         status:
 *           type: string
 *           enum: [UPCOMING, ACTIVE, COMPLETED]
 *           example: UPCOMING
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AcademicYearWithCount:
 *       allOf:
 *         - $ref: '#/components/schemas/AcademicYear'
 *         - type: object
 *           properties:
 *             studentRecordCount:
 *               type: integer
 *               example: 250
 */

/**
 * @swagger
 * /api/academic-years:
 *   get:
 *     summary: Get all academic years
 *     description: Retrieve academic years with optional search and status filtering. Accessible to all authenticated users.
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search academic years by name.
 *         example: "2026"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [UPCOMING, ACTIVE, COMPLETED]
 *         description: Filter academic years by status.
 *         example: UPCOMING
 *     responses:
 *       200:
 *         description: Academic years retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Academic years retrieved successfully."
 *               data:
 *                 - id: "academic_year_123"
 *                   name: "2026/2027"
 *                   startDate: "2026-09-01T00:00:00.000Z"
 *                   endDate: "2027-06-30T00:00:00.000Z"
 *                   status: "UPCOMING"
 *                   createdAt: "2026-11-26T08:00:00.000Z"
 *                   updatedAt: "2026-11-26T08:00:00.000Z"
 *                   studentRecordCount: 250
 *               total: 1
 *       400:
 *         description: Invalid search or status query parameter.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getAcademicYearsController);

/**
 * @swagger
 * /api/academic-years/{id}:
 *   get:
 *     summary: Get academic year by ID
 *     description: Retrieve a specific academic year, including its student record count. Accessible to all authenticated users.
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID.
 *         example: "academic_year_123"
 *     responses:
 *       200:
 *         description: Academic year retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Academic year retrieved successfully."
 *               data:
 *                 id: "academic_year_123"
 *                 name: "2026/2027"
 *                 startDate: "2026-09-01T00:00:00.000Z"
 *                 endDate: "2027-06-30T00:00:00.000Z"
 *                 status: "UPCOMING"
 *                 createdAt: "2026-11-26T08:00:00.000Z"
 *                 updatedAt: "2026-11-26T08:00:00.000Z"
 *                 studentRecordCount: 250
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Academic year not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getAcademicYearByIdController);

/**
 * @swagger
 * /api/academic-years:
 *   post:
 *     summary: Create an academic year
 *     description: Create a new academic year. The initial status is automatically set to UPCOMING. Only ADMIN can perform this operation.
 *     tags: [Academic Years]
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
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: "2026/2027"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2027-06-30T00:00:00.000Z"
 *           example:
 *             name: "2026/2027"
 *             startDate: "2026-09-01T00:00:00.000Z"
 *             endDate: "2027-06-30T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Academic year created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Academic year created successfully."
 *               data:
 *                 id: "academic_year_123"
 *                 name: "2026/2027"
 *                 startDate: "2026-09-01T00:00:00.000Z"
 *                 endDate: "2027-06-30T00:00:00.000Z"
 *                 status: "UPCOMING"
 *                 createdAt: "2026-11-26T08:00:00.000Z"
 *       400:
 *         description: Validation failed or invalid academic year date range.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: ADMIN role required.
 *       409:
 *         description: An academic year with this name already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/",
  requireRole("ADMIN"),
  createAcademicYearController
);

/**
 * @swagger
 * /api/academic-years/{id}:
 *   patch:
 *     summary: Update an academic year
 *     description: Update an academic year's name or date range. Only ADMIN can perform this operation. Completed academic years cannot be updated.
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID.
 *         example: "academic_year_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "2026/2027 Updated"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2027-07-15T00:00:00.000Z"
 *           example:
 *             name: "2026/2027"
 *             endDate: "2027-07-15T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Academic year updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Academic year updated successfully."
 *               data:
 *                 id: "academic_year_123"
 *                 name: "2026/2027"
 *                 startDate: "2026-09-01T00:00:00.000Z"
 *                 endDate: "2027-07-15T00:00:00.000Z"
 *                 status: "UPCOMING"
 *                 createdAt: "2026-11-26T08:00:00.000Z"
 *                 updatedAt: "2026-11-26T09:00:00.000Z"
 *       400:
 *         description: Validation failed or end date is not later than start date.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: ADMIN role required.
 *       404:
 *         description: Academic year not found.
 *       409:
 *         description: Duplicate academic year name or completed academic year cannot be updated.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  "/:id",
  requireRole("ADMIN"),
  updateAcademicYearController
);

/**
 * @swagger
 * /api/academic-years/{id}/status:
 *   patch:
 *     summary: Update academic year status
 *     description: Change an academic year's status to UPCOMING or COMPLETED. ACTIVE status must be managed using the set current academic year operation. Only ADMIN can perform this operation.
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID.
 *         example: "academic_year_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [UPCOMING, COMPLETED]
 *                 example: COMPLETED
 *           example:
 *             status: "COMPLETED"
 *     responses:
 *       200:
 *         description: Academic year status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Academic year status updated successfully."
 *               data:
 *                 id: "academic_year_123"
 *                 name: "2026/2027"
 *                 startDate: "2026-09-01T00:00:00.000Z"
 *                 endDate: "2027-06-30T00:00:00.000Z"
 *                 status: "COMPLETED"
 *                 updatedAt: "2027-07-01T08:00:00.000Z"
 *       400:
 *         description: Validation failed or ACTIVE status cannot be set through this operation.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: ADMIN role required.
 *       404:
 *         description: Academic year not found.
 *       409:
 *         description: Academic year already has the requested status or the current academic year cannot be changed through this operation.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  "/:id/status",
  requireRole("ADMIN"),
  updateAcademicYearStatusController
);

/**
 * @swagger
 * /api/academic-years/{id}/current:
 *   patch:
 *     summary: Set current academic year
 *     description: Set an upcoming academic year as the current academic year. Any previously active academic year is automatically marked as COMPLETED. Only ADMIN can perform this operation.
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID to activate.
 *         example: "academic_year_123"
 *     responses:
 *       200:
 *         description: Current academic year updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Current academic year updated successfully."
 *               data:
 *                 id: "academic_year_123"
 *                 name: "2026/2027"
 *                 startDate: "2026-09-01T00:00:00.000Z"
 *                 endDate: "2027-06-30T00:00:00.000Z"
 *                 status: "ACTIVE"
 *                 updatedAt: "2026-11-26T09:00:00.000Z"
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: ADMIN role required.
 *       404:
 *         description: Academic year not found.
 *       409:
 *         description: Academic year is already active, completed, or another academic year update is in progress.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  "/:id/current",
  requireRole("ADMIN"),
  setCurrentAcademicYearController
);

export default router;
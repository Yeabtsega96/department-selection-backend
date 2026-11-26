
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import {
    createCampusController,
    getCampusesController,
    getCampusByIdController,
    updateCampusController,
} from "./campus.controller.js";

const router = Router();



/**
 * @swagger
 * tags:
 *   name: Campuses
 *   description: Campus management
 */

/**
 * @swagger
 * /api/campuses:
 *   get:
 *     summary: Get all active campuses
 *     description: Retrieve all active campuses, including the number of departments associated with each campus.
 *     tags: [Campuses]
 *     responses:
 *       200:
 *         description: Campuses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Campus'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - id: "campus_123"
 *                   code: "MAIN"
 *                   name: "Main Campus"
 *                   isActive: true
 *                   _count:
 *                     departments: 12
 *                 - id: "campus_456"
 *                   code: "SHB"
 *                   name: "Shambu Campus"
 *                   isActive: true
 *                   _count:
 *                     departments: 5
 *       500:
 *         description: Internal server error.
 */
router.get("/", getCampusesController);

/**
 * @swagger
 * /api/campuses/{id}:
 *   get:
 *     summary: Get campus by ID
 *     description: Retrieve an active campus by its ID, including its active departments.
 *     tags: [Campuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus ID.
 *     responses:
 *       200:
 *         description: Campus retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Campus'
 *             example:
 *               success: true
 *               data:
 *                 id: "campus_123"
 *                 code: "MAIN"
 *                 name: "Main Campus"
 *                 isActive: true
 *                 departments:
 *                   - id: "dept_123"
 *                     code: "CS"
 *                     name: "Computer Science"
 *                     isActive: true
 *       404:
 *         description: Campus not found or inactive.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getCampusByIdController);

/**
 * @swagger
 * /api/campuses:
 *   post:
 *     summary: Create a campus
 *     description: Allows an authenticated Admin to create a new campus.
 *     tags: [Campuses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "MAIN"
 *               name:
 *                 type: string
 *                 example: "Main Campus"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - code
 *               - name
 *     responses:
 *       201:
 *         description: Campus created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Campus created successfully."
 *               data:
 *                 id: "campus_123"
 *                 code: "MAIN"
 *                 name: "Main Campus"
 *                 isActive: true
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Admins can create campuses.
 *       409:
 *         description: A campus with this code already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    createCampusController
);

/**
 * @swagger
 * /api/campuses/{id}:
 *   patch:
 *     summary: Update a campus
 *     description: Allows an authenticated Admin to update an existing campus.
 *     tags: [Campuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campus ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "MAIN"
 *               name:
 *                 type: string
 *                 example: "Main Campus"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Campus updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Campus updated successfully."
 *               data:
 *                 id: "campus_123"
 *                 code: "MAIN"
 *                 name: "Main Campus"
 *                 isActive: true
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Admins can update campuses.
 *       404:
 *         description: Campus not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    updateCampusController
);

export default router;

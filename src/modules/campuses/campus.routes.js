
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
 *     summary: Get all campuses
 *     description: Retrieve a list of all campuses.
 *     tags: [Campuses]
 *     responses:
 *       200:
 *         description: Campuses retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getCampusesController);

/**
 * @swagger
 * /api/campuses/{id}:
 *   get:
 *     summary: Get campus by ID
 *     description: Retrieve a specific campus using its ID.
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
 *       404:
 *         description: Campus not found.
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
 *     responses:
 *       201:
 *         description: Campus created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Admins can create campuses.
 *       409:
 *         description: Campus code already exists.
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
 *     responses:
 *       200:
 *         description: Campus updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Admins can update campuses.
 *       404:
 *         description: Campus not found.
 */
router.patch(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    updateCampusController
);

export default router;

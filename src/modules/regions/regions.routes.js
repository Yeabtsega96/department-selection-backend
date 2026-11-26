import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

import { 
    createRegionController,
    getRegionsController,
    getRegionByIdController,
    updateRegionController,
    updateRegionStatusController,
} from "./regions.controller.js";


const router = Router();

router.use(requireAuth);

router.get("/", getRegionsController);

router.get("/:id", getRegionByIdController);

router.post("/", requireRole("ADMIN"), createRegionController);

router.patch("/:id", requireRole("ADMIN"), updateRegionController);

router.patch("/:id/status", requireRole("ADMIN"), updateRegionStatusController);


/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Region management
 */

/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: Get all regions
 *     description: Retrieve regions with optional search and filtering.
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search regions by name or code.
 *       - in: query
 *         name: isDevelopingRegion
 *         schema:
 *           type: boolean
 *         description: Filter by developing-region status.
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status.
 *     responses:
 *       200:
 *         description: Regions retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Regions retrieved successfully.
 *               data:
 *                 regions:
 *                   - id: "region_123"
 *                     name: "Oromia"
 *                     code: "OR"
 *                     isDevelopingRegion: false
 *                     isActive: true
 *               total: 1
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Authentication required.
 */

/**
 * @swagger
 * /api/regions/{id}:
 *   get:
 *     summary: Get region by ID
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID.
 *     responses:
 *       200:
 *         description: Region retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Region retrieved successfully.
 *               data:
 *                 id: "region_123"
 *                 name: "Oromia"
 *                 code: "OR"
 *                 isDevelopingRegion: false
 *                 isActive: true
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Region not found.
 */

/**
 * @swagger
 * /api/regions:
 *   post:
 *     summary: Create a region
 *     tags: [Regions]
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
 *                 example: Oromia
 *               code:
 *                 type: string
 *                 example: OR
 *               isDevelopingRegion:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - name
 *               - code
 *     responses:
 *       201:
 *         description: Region created successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Region created successfully.
 *               data:
 *                 id: "region_123"
 *                 name: "Oromia"
 *                 code: "OR"
 *                 isDevelopingRegion: false
 *                 isActive: true
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: ADMIN role required.
 *       409:
 *         description: Region already exists.
 */

/**
 * @swagger
 * /api/regions/{id}:
 *   patch:
 *     summary: Update a region
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields allowed by the region update validator.
 *             properties:
 *               name:
 *                 type: string
 *                 example: Oromia
 *               code:
 *                 type: string
 *                 example: OR
 *               isDevelopingRegion:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Region updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Region updated successfully.
 *               data:
 *                 id: "region_123"
 *                 name: "Oromia"
 *                 code: "OR"
 *                 isDevelopingRegion: false
 *                 isActive: true
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: ADMIN role required.
 *       404:
 *         description: Region not found.
 */

/**
 * @swagger
 * /api/regions/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a region
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Region ID.
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
 *         description: Region status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Region status updated successfully.
 *               data:
 *                 id: "region_123"
 *                 name: "Oromia"
 *                 code: "OR"
 *                 isActive: false
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: ADMIN role required.
 *       404:
 *         description: Region not found.
 */

export default router;
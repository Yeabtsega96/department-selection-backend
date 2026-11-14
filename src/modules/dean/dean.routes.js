
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { createDepartmentHeadController } from "./dean.controller.js";

const router = Router();

// All Dean routes require DEAN authentication
router.use(requireAuth, requireRole("DEAN"));

/**
 * @swagger
 * /api/dean/department-heads:
 *   post:
 *     summary: Create a Department Head
 *     description: Allows an authenticated Dean to create a Department Head account.
 *     tags:
 *       - Dean
 *     responses:
 *       201:
 *         description: Department Head account created successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only Deans can perform this action.
 */
router.post("/department-heads", createDepartmentHeadController);

export default router;

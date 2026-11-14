
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/account/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the authenticated user's profile and session information.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User and session information retrieved successfully.
 *       401:
 *         description: Authentication required.
 */
router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
    },
    session: {
      expiresAt: req.session.expiresAt,
    },
  });
});

/**
 * @swagger
 * /api/account/admin-test:
 *   get:
 *     summary: Test administrator authorization
 *     description: Allows only authenticated administrators to access this endpoint.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Administrator authorization successful.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Administrator permission required.
 */
router.get(
  "/admin-test",
  requireAuth,
  requireRole("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome, Administrator!",
    });
  }
);

export default router;

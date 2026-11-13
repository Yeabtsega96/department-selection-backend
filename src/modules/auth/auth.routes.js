
import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";

const router = Router();

// Get currently authenticated user
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

// Admin-only test endpoint
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

import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { getDashboard, createUniversityUserController } from "./admin.controller.js";

const router = Router();

// All admin routes require ADMIN authentication
router.use(requireAuth, requireRole("ADMIN"));

// Dashboard
router.get("/dashboard", getDashboard);

// Create Dean or Coordinator
router.post("/users", createUniversityUserController);

export default router;
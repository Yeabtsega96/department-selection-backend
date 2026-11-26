import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";


const router = Router();

// All coordinator routes require COORDINATOR authentication
router.use(requireAuth, requireRole("COORDINATOR"))

export default router;
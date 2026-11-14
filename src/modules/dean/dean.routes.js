import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { createDepartmentHeadController } from "./dean.controller.js";

const router = Router();

router.use(requireAuth, requireRole("DEAN"));

router.post("/department-heads", createDepartmentHeadController);

export default router;
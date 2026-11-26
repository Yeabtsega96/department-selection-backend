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


export default router;
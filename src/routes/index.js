import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import adminRouter from "../modules/admin/admin.routes.js";
import deanRouter from "../modules/dean/dean.routes.js";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Check whether the Department Selection API is running.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API is healthy.
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Department Selection API is healthy.",
    timestamp: new Date().toISOString(),
  });
});

router.use("/account", authRouter); 
router.use("/admin", adminRouter);
  
router.use("/dean", deanRouter);


export default router;
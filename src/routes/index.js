import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Department Selection API is healthy.",
    timestamp: new Date().toISOString(),
  });
});

router.get("/account", authRouter);


export default router;

import express from "express";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";

import apiRouter from "./routes/index.js";

import { notFound } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

// Hide Express information
app.disable("x-powered-by");

// CORS configuration
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Better Auth middleware
app.all("/api/auth/*splat", toNodeHandler(auth));

// Request body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Department Selection API is running.",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// API routes
app.use("/api", apiRouter);

// Handle unknown routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

export default app;

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const isOperationalError = statusCode < 500;

  if (isOperationalError) {
    // Clean, single-line log without stack trace noise
    console.warn(`[${statusCode}] ${req.method} ${req.originalUrl}: ${err.message}`);
  } else {
    // Full stack trace only for real 500 server bugs
    console.error("API Critical Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && !isOperationalError
        ? "Something went wrong."
        : err.message || "Internal Server Error",
  });
}

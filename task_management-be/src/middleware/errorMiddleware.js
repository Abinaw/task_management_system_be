const { AppError } = require("../errors/AppError");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "ConflictException",
        message: "A record with this value already exists",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        error: "NotFoundException",
        message: "Record not found",
      });
    }
  }

  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({
      error: "ValidationError",
      message: "Invalid data provided — check your request body",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "UnauthorizedException",
      message: "Token expired, please login again",
    });
  }

  return res.status(500).json({
    error: "InternalServerError",
    message: err.message || "Something went wrong",
  });
};

const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.status = 404;
  next(err);
};

module.exports = { errorHandler, notFound };

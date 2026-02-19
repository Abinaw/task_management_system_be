class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

class NotFoundException extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundException";
  }
}

class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedException";
  }
}

class BadRequestException extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
    this.name = "BadRequestException";
  }
}

class ConflictException extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
    this.name = "ConflictException";
  }
}

module.exports = {
  AppError,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
};

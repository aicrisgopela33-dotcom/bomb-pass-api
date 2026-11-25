class AppError extends Error {
  constructor(status, code, message, details = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(code, message, details = null) {
    return new AppError(400, code, message, details);
  }

  static unauthorized(code, message, details = null) {
    return new AppError(401, code, message, details);
  }

  static forbidden(code, message, details = null) {
    return new AppError(403, code, message, details);
  }

  static notFound(code, message, details = null) {
    return new AppError(404, code, message, details);
  }

  static conflict(code, message, details = null) {
    return new AppError(409, code, message, details);
  }
}

module.exports = AppError;

const { validationResult } = require('express-validator');
const AppError = require('../errors/app-error');

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const details = result.array().map((problem) => ({
    field: problem.path || 'body',
    message: problem.msg,
  }));

  return next(
    AppError.badRequest(
      'VALIDATION_FAILED',
      'One or more request fields are invalid.',
      details
    )
  );
}

module.exports = validate;

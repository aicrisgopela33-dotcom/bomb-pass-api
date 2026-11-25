const AppError = require('../errors/app-error');

function requireUser(...roles) {
  return function guard(req, res, next) {
    if (!req.user) {
      return next(
        AppError.unauthorized(
          'AUTH_REQUIRED',
          'Who you are first: send the X-Demo-User header.'
        )
      );
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          'FORBIDDEN',
          `Only these roles may do this: ${roles.join(', ')}.`
        )
      );
    }

    return next();
  };
}

module.exports = requireUser;

const { mapDatabaseError } = require('../errors/constraint-map');

function errorHandler(err, req, res, next) {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'The request body is not valid JSON.',
      },
    });
  }

  const mappedDb = mapDatabaseError(err);
  if (mappedDb) {
    return res.status(mappedDb.status).json({
      error: {
        code: mappedDb.code,
        message: mappedDb.message,
      },
    });
  }

  const status = err?.status || 500;
  const isServerFault = status >= 500;

  if (isServerFault) {
    console.error(err);
  }

  const payload = {
    error: {
      code: isServerFault ? 'INTERNAL_ERROR' : err.code || 'BAD_REQUEST',
      message: isServerFault
        ? 'Something went wrong on the server.'
        : err.message,
    },
  };

  if (!isServerFault && err.details) {
    payload.error.details = err.details;
  }

  return res.status(status).json(payload);
}

module.exports = errorHandler;

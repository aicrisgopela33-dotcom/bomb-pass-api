const { body, param } = require('express-validator');

const sessionIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer.')
    .toInt(),
];

const playerIdParam = [
  param('playerId')
    .isInt({ min: 1 })
    .withMessage('playerId must be a positive integer.')
    .toInt(),
];

const joinRules = [
  ...sessionIdParam,
  body('nickname')
    .exists({ checkFalsy: true })
    .withMessage('nickname is required.')
    .bail()
    .isString()
    .withMessage('nickname must be a string.')
    .trim()
    .isLength({ min: 2, max: 24 })
    .withMessage('nickname must be 2 to 24 characters long.'),
];

const updateStatusRules = [
  ...playerIdParam,
  body('player_status')
    .optional()
    .isIn(['JOINED', 'ACTIVE', 'ELIMINATED', 'FORFEITED', 'FINISHED'])
    .withMessage(
      'player_status must be one of: JOINED, ACTIVE, ELIMINATED, FORFEITED, FINISHED.'
    ),
  body('connection_status')
    .optional()
    .isIn(['CONNECTED', 'DISCONNECTED'])
    .withMessage('connection_status must be CONNECTED or DISCONNECTED.'),
  body('score')
    .optional()
    .isInt({ min: 0 })
    .withMessage('score must be a non-negative integer.')
    .toInt(),
  body('final_rank')
    .optional()
    .isInt({ min: 1 })
    .withMessage('final_rank must be a positive integer.')
    .toInt(),
];

module.exports = {
  sessionIdParam,
  playerIdParam,
  joinRules,
  updateStatusRules,
};

const { body, param, query } = require('express-validator');

const sessionIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer.')
    .toInt(),
];

const listQuery = [
  query('status')
    .optional()
    .isIn(['waiting', 'playing', 'ended'])
    .withMessage('status must be one of: waiting, playing, ended.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100.')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a non-negative integer.')
    .toInt(),
];

const createRules = [
  body('question_set_id')
    .exists({ checkFalsy: true })
    .withMessage('question_set_id is required.')
    .bail()
    .isInt({ min: 1 })
    .withMessage('question_set_id must be a positive integer.')
    .toInt(),
  body('duration_limit_minutes')
    .optional()
    .isInt({ min: 5, max: 15 })
    .withMessage('duration_limit_minutes must be between 5 and 15.')
    .toInt(),
  body('bomb_time_limit_seconds')
    .optional()
    .isInt({ min: 10, max: 120 })
    .withMessage('bomb_time_limit_seconds must be between 10 and 120.')
    .toInt(),
];

const endRules = [
  ...sessionIdParam,
  body('session_end_reason')
    .optional()
    .isIn(['last_player', 'duration_limit', 'host_ended'])
    .withMessage(
      'session_end_reason must be one of: last_player, duration_limit, host_ended.'
    ),
];

module.exports = {
  sessionIdParam,
  listQuery,
  createRules,
  endRules,
};

const { body, param } = require('express-validator');

const idParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer.')
    .toInt(),
];

const createRules = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('title is required.')
    .bail()
    .isString()
    .withMessage('title must be a string.')
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('title must be 3 to 120 characters long.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('description must be a string.')
    .trim(),
  body('subject')
    .optional({ nullable: true })
    .isString()
    .withMessage('subject must be a string.')
    .trim()
    .isLength({ max: 80 })
    .withMessage('subject must be at most 80 characters long.'),
  body('grade_level')
    .optional({ nullable: true })
    .isString()
    .withMessage('grade_level must be a string.')
    .trim()
    .isLength({ max: 40 })
    .withMessage('grade_level must be at most 40 characters long.'),
];

const updateRules = [
  ...idParam,
  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string.')
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('title must be 3 to 120 characters long.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('description must be a string.')
    .trim(),
  body('subject')
    .optional({ nullable: true })
    .isString()
    .withMessage('subject must be a string.')
    .trim()
    .isLength({ max: 80 })
    .withMessage('subject must be at most 80 characters long.'),
  body('grade_level')
    .optional({ nullable: true })
    .isString()
    .withMessage('grade_level must be a string.')
    .trim()
    .isLength({ max: 40 })
    .withMessage('grade_level must be at most 40 characters long.'),
];

module.exports = {
  idParam,
  createRules,
  updateRules,
};

const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/session.validator');
const controller = require('../controllers/session.controller');

const router = Router();

router.get('/', rules.listQuery, validate, controller.list);
router.get('/:id', rules.sessionIdParam, validate, controller.getOne);

router.post(
  '/',
  requireUser('HOST', 'ADMIN'),
  rules.createRules,
  validate,
  controller.create
);

router.post(
  '/:id/start',
  requireUser('HOST', 'ADMIN'),
  rules.sessionIdParam,
  validate,
  controller.start
);

router.post(
  '/:id/end',
  requireUser('HOST', 'ADMIN'),
  rules.endRules,
  validate,
  controller.end
);

module.exports = router;

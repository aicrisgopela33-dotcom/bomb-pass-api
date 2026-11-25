const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/player.validator');
const controller = require('../controllers/player.controller');

const router = Router();

// Session-scoped player routes (mounted at /sessions/:id/players)
const sessionPlayerRouter = Router({ mergeParams: true });
sessionPlayerRouter.get('/', rules.sessionIdParam, validate, controller.listBySession);
sessionPlayerRouter.post(
  '/join',
  requireUser('PLAYER', 'HOST', 'ADMIN'),
  rules.joinRules,
  validate,
  controller.joinOrRejoin
);

// Player-scoped routes (mounted at /players)
router.patch(
  '/:playerId/status',
  requireUser('PLAYER', 'HOST', 'ADMIN'),
  rules.updateStatusRules,
  validate,
  controller.updateStatus
);

router.post(
  '/:playerId/leave',
  requireUser('PLAYER', 'HOST', 'ADMIN'),
  rules.playerIdParam,
  validate,
  controller.leave
);

module.exports = router;
module.exports.sessionPlayerRouter = sessionPlayerRouter;

const { Router } = require('express');
const currentUser = require('../middlewares/current-user');
const playerRoutes = require('./player.routes');

const router = Router();

router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

router.use(currentUser);
router.use('/question-sets', require('./question-set.routes'));
router.use('/sessions', require('./session.routes'));
router.use('/sessions/:id/players', playerRoutes.sessionPlayerRouter);
router.use('/players', playerRoutes);

module.exports = router;

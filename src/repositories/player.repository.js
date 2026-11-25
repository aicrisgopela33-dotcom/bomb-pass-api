const { Op } = require('sequelize');
const { sequelize, DataTypes } = require('../models');
const Player = require('../models/player')(sequelize, DataTypes);

function findById(playerId) {
  return Player.findByPk(playerId);
}

function findBySessionAndUser(sessionId, userId) {
  return Player.findOne({
    where: {
      session_id: sessionId,
      user_id: userId,
    },
  });
}

function findAllBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['player_id', 'ASC']],
  });
}

function countBySession(sessionId) {
  return Player.count({
    where: { session_id: sessionId },
  });
}

function findActiveMembershipForUser(userId, excludeSessionId = null) {
  const where = {
    user_id: userId,
    player_status: { [Op.in]: ['JOINED', 'ACTIVE'] },
    connection_status: 'CONNECTED',
  };
  if (excludeSessionId) {
    where.session_id = { [Op.ne]: excludeSessionId };
  }

  return Player.findOne({ where });
}

function create(data) {
  return Player.create(data);
}

function update(player, changes) {
  return player.update(changes);
}

module.exports = {
  Player,
  findById,
  findBySessionAndUser,
  findAllBySession,
  countBySession,
  findActiveMembershipForUser,
  create,
  update,
};

const { Op } = require('sequelize');
const { sequelize, DataTypes } = require('../models');
const GameSession = require('../models/session')(sequelize, DataTypes);

function findById(sessionId) {
  return GameSession.findByPk(sessionId);
}

function findByJoinCodeOpen(joinCode) {
  return GameSession.findOne({
    where: {
      join_code: joinCode,
      status: { [Op.in]: ['waiting', 'playing'] },
    },
  });
}

function findOpenByHost(hostUserId) {
  return GameSession.findOne({
    where: {
      host_user_id: hostUserId,
      status: { [Op.in]: ['waiting', 'playing'] },
    },
  });
}

function findAll({ status, limit = 20, offset = 0 }) {
  const where = {};
  if (status) {
    where.status = status;
  }

  return GameSession.findAndCountAll({
    where,
    order: [['session_id', 'DESC']],
    limit,
    offset,
  });
}

function create(data) {
  return GameSession.create(data);
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = {
  GameSession,
  findById,
  findByJoinCodeOpen,
  findOpenByHost,
  findAll,
  create,
  update,
};

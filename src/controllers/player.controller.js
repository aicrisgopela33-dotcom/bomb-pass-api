const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

function toJson(player) {
  return {
    player_id: player.player_id,
    session_id: player.session_id,
    user_id: player.user_id,
    nickname: player.nickname,
    score: player.score,
    player_status: player.player_status,
    connection_status: player.connection_status,
    joined_at: player.joined_at,
    last_seen_at: player.last_seen_at,
    disconnected_at: player.disconnected_at,
    eliminated_at: player.eliminated_at,
    forfeited_at: player.forfeited_at,
    finished_at: player.finished_at,
    final_rank: player.final_rank,
  };
}

async function listBySession(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const players = await playerService.listBySession(Number(id));
    return res.status(200).json(players.map(toJson));
  } catch (err) {
    return next(err);
  }
}

async function joinOrRejoin(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const data = matchedData(req, { locations: ['body'] });
    const player = await playerService.joinOrRejoin(
      Number(id),
      data,
      req.user
    );
    return res.status(200).json(toJson(player));
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { playerId } = matchedData(req, { locations: ['params'] });
    const data = matchedData(req, { locations: ['body'] });
    const player = await playerService.updateStatus(
      Number(playerId),
      data,
      req.user
    );
    return res.status(200).json(toJson(player));
  } catch (err) {
    return next(err);
  }
}

async function leave(req, res, next) {
  try {
    const { playerId } = matchedData(req, { locations: ['params'] });
    const player = await playerService.leave(Number(playerId), req.user);
    return res.status(200).json(toJson(player));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listBySession,
  joinOrRejoin,
  updateStatus,
  leave,
};

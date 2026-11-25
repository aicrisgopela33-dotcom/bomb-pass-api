const AppError = require('../errors/app-error');
const sessionService = require('./session.service');
const playerRepository = require('../repositories/player.repository');

const MAX_PLAYERS_PER_SESSION = 8;

async function findOrFail(playerId) {
  const player = await playerRepository.findById(playerId);
  if (!player) {
    throw AppError.notFound(
      'PLAYER_NOT_FOUND',
      `No player has the id ${playerId}.`
    );
  }
  return player;
}

async function listBySession(sessionId) {
  await sessionService.findOrFail(sessionId);
  return playerRepository.findAllBySession(sessionId);
}

async function joinOrRejoin(sessionId, data, user) {
  const session = await sessionService.findOrFail(sessionId);

  if (session.status === 'ended') {
    throw AppError.conflict(
      'SESSION_ENDED',
      'Cannot join a session that has already ended.'
    );
  }

  const otherActive = await playerRepository.findActiveMembershipForUser(
    user.user_id,
    sessionId
  );
  if (otherActive) {
    throw AppError.conflict(
      'ALREADY_IN_ANOTHER_GAME',
      'You are already connected in another active game session.'
    );
  }

  const existing = await playerRepository.findBySessionAndUser(
    sessionId,
    user.user_id
  );
  const now = new Date();

  if (existing) {
    const changes = {
      connection_status: 'CONNECTED',
      last_seen_at: now,
      disconnected_at: null,
    };
    if (data.nickname) {
      changes.nickname = data.nickname;
    }
    if (existing.player_status === 'JOINED' && session.status === 'playing') {
      changes.player_status = 'ACTIVE';
    }
    return playerRepository.update(existing, changes);
  }

  if (session.status !== 'waiting') {
    throw AppError.conflict(
      'GAME_ALREADY_STARTED',
      'New players can only join while the session is waiting in the lobby.'
    );
  }

  const playerCount = await playerRepository.countBySession(sessionId);
  if (playerCount >= MAX_PLAYERS_PER_SESSION) {
    throw AppError.conflict(
      'SESSION_FULL',
      `This session has reached the maximum of ${MAX_PLAYERS_PER_SESSION} players.`
    );
  }

  return playerRepository.create({
    session_id: sessionId,
    user_id: user.user_id,
    nickname: data.nickname,
    score: 0,
    player_status: 'JOINED',
    connection_status: 'CONNECTED',
    joined_at: now,
    last_seen_at: now,
  });
}

async function updateStatus(playerId, data, user) {
  const player = await findOrFail(playerId);
  const session = await sessionService.findOrFail(player.session_id);

  const isSelf = player.user_id === user.user_id;
  const isHostOrAdmin =
    session.host_user_id === user.user_id || user.role === 'ADMIN';

  if (!isSelf && !isHostOrAdmin) {
    throw AppError.forbidden(
      'FORBIDDEN',
      'You do not have permission to update this player.'
    );
  }

  const now = new Date();
  const changes = {
    last_seen_at: now,
  };

  if (data.player_status) {
    changes.player_status = data.player_status;
    if (data.player_status === 'ELIMINATED') {
      changes.eliminated_at = now;
    } else if (data.player_status === 'FORFEITED') {
      changes.forfeited_at = now;
      changes.connection_status = 'DISCONNECTED';
      changes.disconnected_at = now;
    } else if (data.player_status === 'FINISHED') {
      changes.finished_at = now;
    }
  }

  if (data.connection_status) {
    changes.connection_status = data.connection_status;
    changes.disconnected_at =
      data.connection_status === 'DISCONNECTED' ? now : null;
  }

  if (typeof data.score === 'number') {
    changes.score = data.score;
  }

  if (typeof data.final_rank === 'number') {
    changes.final_rank = data.final_rank;
  }

  return playerRepository.update(player, changes);
}

async function leave(playerId, user) {
  const player = await findOrFail(playerId);
  const session = await sessionService.findOrFail(player.session_id);

  const isSelf = player.user_id === user.user_id;
  const isHostOrAdmin =
    session.host_user_id === user.user_id || user.role === 'ADMIN';

  if (!isSelf && !isHostOrAdmin) {
    throw AppError.forbidden(
      'FORBIDDEN',
      'You can only leave your own player slot unless you are the host.'
    );
  }

  const now = new Date();
  const nextStatus =
    player.player_status === 'JOINED' ? 'FORFEITED' : player.player_status;

  return playerRepository.update(player, {
    player_status: nextStatus,
    connection_status: 'DISCONNECTED',
    disconnected_at: now,
    forfeited_at: nextStatus === 'FORFEITED' ? now : player.forfeited_at,
    last_seen_at: now,
  });
}

module.exports = {
  findOrFail,
  listBySession,
  joinOrRejoin,
  updateStatus,
  leave,
};

const AppError = require('../errors/app-error');
const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');

function generateJoinCode() {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const rest = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `${firstDigit}${rest}`;
}

async function createUniqueJoinCode() {
  for (let i = 0; i < 10; i += 1) {
    const code = generateJoinCode();
    const existing = await sessionRepository.findByJoinCodeOpen(code);
    if (!existing) {
      return code;
    }
  }
  throw AppError.conflict(
    'JOIN_CODE_GENERATION_FAILED',
    'Unable to generate a unique join code right now.'
  );
}

async function findOrFail(sessionId) {
  const session = await sessionRepository.findById(sessionId);
  if (!session) {
    throw AppError.notFound(
      'SESSION_NOT_FOUND',
      `No game session has the id ${sessionId}.`
    );
  }
  return session;
}

async function create(data, user) {
  const questionSet = await questionSetRepository.findById(data.question_set_id);
  if (!questionSet) {
    throw AppError.notFound(
      'QUESTION_SET_NOT_FOUND',
      `No question set has the id ${data.question_set_id}.`
    );
  }

  const existingOpen = await sessionRepository.findOpenByHost(user.user_id);
  if (existingOpen) {
    throw AppError.conflict(
      'ACTIVE_SESSION_EXISTS',
      'You already have an active or waiting game session.'
    );
  }

  const joinCode = await createUniqueJoinCode();

  return sessionRepository.create({
    host_user_id: user.user_id,
    question_set_id: data.question_set_id,
    join_code: joinCode,
    status: 'waiting',
    duration_limit_minutes: data.duration_limit_minutes ?? 10,
    bomb_time_limit_seconds: data.bomb_time_limit_seconds ?? 30,
    current_cycle_number: 1,
    created_at: new Date(),
  });
}

async function list(query) {
  return sessionRepository.findAll(query);
}

async function getOne(sessionId) {
  return findOrFail(sessionId);
}

async function start(sessionId, user) {
  const session = await findOrFail(sessionId);
  if (session.host_user_id !== user.user_id && user.role !== 'ADMIN') {
    throw AppError.forbidden(
      'FORBIDDEN',
      'Only the host of this session can start the game.'
    );
  }
  if (session.status !== 'waiting') {
    throw AppError.conflict(
      'INVALID_SESSION_STATE',
      `Cannot start a session with status "${session.status}".`
    );
  }

  return sessionRepository.update(session, {
    status: 'playing',
    started_at: new Date(),
  });
}

async function end(sessionId, endReason, user) {
  const session = await findOrFail(sessionId);
  if (session.host_user_id !== user.user_id && user.role !== 'ADMIN') {
    throw AppError.forbidden(
      'FORBIDDEN',
      'Only the host of this session can end the game.'
    );
  }
  if (session.status === 'ended') {
    throw AppError.conflict(
      'SESSION_ALREADY_ENDED',
      'This session has already ended.'
    );
  }

  return sessionRepository.update(session, {
    status: 'ended',
    session_end_reason: endReason || 'host_ended',
    ended_at: new Date(),
  });
}

module.exports = {
  findOrFail,
  create,
  list,
  getOne,
  start,
  end,
};

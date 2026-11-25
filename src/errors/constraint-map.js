const CONSTRAINT_MAP = {
  uq_players_session_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },
  uq_players_session_user: {
    status: 409,
    code: 'ALREADY_IN_SESSION',
    message: 'You are already in this session.',
  },
  uq_game_sessions_join_code_open: {
    status: 409,
    code: 'JOIN_CODE_IN_USE',
    message: 'A join code collision occurred on an active session. Please retry.',
  },
  game_sessions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set is used in a game session and cannot be deleted.',
  },
  idx_game_sessions_question_set_id: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set is used in a game session and cannot be deleted.',
  },
};

function mapDatabaseError(err) {
  const constraintName =
    err?.parent?.constraint ||
    err?.original?.constraint ||
    err?.fields?.constraint ||
    null;

  if (constraintName && CONSTRAINT_MAP[constraintName]) {
    return CONSTRAINT_MAP[constraintName];
  }

  if (err?.name === 'SequelizeForeignKeyConstraintError') {
    return {
      status: 409,
      code: 'RESOURCE_IN_USE',
      message: 'This record is referenced by another resource.',
    };
  }

  if (err?.name === 'SequelizeUniqueConstraintError') {
    return {
      status: 409,
      code: 'DUPLICATE_RECORD',
      message: 'A record with that unique value already exists.',
    };
  }

  return null;
}

module.exports = { CONSTRAINT_MAP, mapDatabaseError };

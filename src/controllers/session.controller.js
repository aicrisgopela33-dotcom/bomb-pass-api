const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(session) {
  return {
    session_id: session.session_id,
    host_user_id: session.host_user_id,
    question_set_id: session.question_set_id,
    join_code: session.join_code,
    status: session.status,
    duration_limit_minutes: session.duration_limit_minutes,
    bomb_time_limit_seconds: session.bomb_time_limit_seconds,
    session_end_reason: session.session_end_reason,
    bomb_holder_player_id: session.bomb_holder_player_id,
    bomb_expires_at: session.bomb_expires_at,
    current_question_id: session.current_question_id,
    current_cycle_number: session.current_cycle_number,
    question_expires_at: session.question_expires_at,
    winner_player_id: session.winner_player_id,
    created_at: session.created_at,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function create(req, res, next) {
  try {
    const data = matchedData(req, { locations: ['body'] });
    const session = await sessionService.create(data, req.user);
    return res.status(201).json(toJson(session));
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const query = matchedData(req, { locations: ['query'] });
    const { rows, count } = await sessionService.list(query);
    return res.status(200).json({
      items: rows.map(toJson),
      total: count,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    });
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const session = await sessionService.getOne(Number(id));
    return res.status(200).json(toJson(session));
  } catch (err) {
    return next(err);
  }
}

async function start(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const session = await sessionService.start(Number(id), req.user);
    return res.status(200).json(toJson(session));
  } catch (err) {
    return next(err);
  }
}

async function end(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const data = matchedData(req, { locations: ['body'] });
    const session = await sessionService.end(
      Number(id),
      data.session_end_reason,
      req.user
    );
    return res.status(200).json(toJson(session));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  getOne,
  start,
  end,
};

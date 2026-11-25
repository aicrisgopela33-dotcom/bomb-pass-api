const { matchedData } = require('express-validator');
const questionSetService = require('../services/question-set.service');

function toJson(set) {
  return {
    question_set_id: set.question_set_id,
    owner_user_id: set.owner_user_id,
    title: set.title,
    description: set.description,
    subject: set.subject,
    grade_level: set.grade_level,
  };
}

async function list(req, res, next) {
  try {
    const sets = await questionSetService.list(req.user);
    return res.status(200).json(sets.map(toJson));
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const set = await questionSetService.getOne(Number(id), req.user);
    return res.status(200).json(toJson(set));
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = matchedData(req, { locations: ['body'] });
    const set = await questionSetService.create(data, req.user);
    return res.status(201).json(toJson(set));
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    const changes = matchedData(req, { locations: ['body'] });
    const set = await questionSetService.update(Number(id), changes, req.user);
    return res.status(200).json(toJson(set));
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = matchedData(req, { locations: ['params'] });
    await questionSetService.remove(Number(id), req.user);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
};

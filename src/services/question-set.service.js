const AppError = require('../errors/app-error');
const questionSetRepository = require('../repositories/question-set.repository');

async function findOrFail(questionSetId) {
  const set = await questionSetRepository.findById(questionSetId);
  if (!set) {
    throw AppError.notFound(
      'QUESTION_SET_NOT_FOUND',
      `No question set has the id ${questionSetId}.`
    );
  }
  return set;
}

function canModify(questionSet, user) {
  if (!user) return false;
  return questionSet.owner_user_id === user.user_id || user.role === 'ADMIN';
}

async function list(user) {
  if (user && user.role === 'ADMIN') {
    return questionSetRepository.findAll();
  }
  return questionSetRepository.findAllByOwner(user.user_id);
}

async function getOne(questionSetId, user) {
  const set = await findOrFail(questionSetId);
  if (!canModify(set, user)) {
    throw AppError.forbidden(
      'FORBIDDEN',
      'This question set belongs to another host.'
    );
  }
  return set;
}

async function create(data, user) {
  return questionSetRepository.create({
    ...data,
    owner_user_id: user.user_id,
  });
}

async function update(questionSetId, changes, user) {
  const set = await findOrFail(questionSetId);
  if (!canModify(set, user)) {
    throw AppError.forbidden(
      'FORBIDDEN',
      'This question set belongs to another host.'
    );
  }
  return questionSetRepository.update(set, changes);
}

async function remove(questionSetId, user) {
  const set = await findOrFail(questionSetId);
  if (!canModify(set, user)) {
    throw AppError.forbidden(
      'FORBIDDEN',
      'This question set belongs to another host.'
    );
  }
  await questionSetRepository.remove(set);
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
};
